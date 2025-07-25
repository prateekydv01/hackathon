import { Emergency } from "../models/emergency.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getSocketInstance } from "../utils/socketInstance.js";
import axios from "axios";

/* ---------- helpers ---------- */
const geocode = async (lat, lng) => {
  try {
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}`
    );
    return data?.results?.[0]?.formatted || `${lat},${lng}`;
  } catch {
    return `${lat},${lng}`;
  }
};

/* ---------- create emergency ---------- */
export const createEmergency = asyncHandler(async (req, res) => {
  const { emergencyType, customIssue, description, priority } = req.body;
  const senderId = req.user._id;

  if (!emergencyType || !description)
    throw new ApiError(400, "Emergency type & description required");
  if (emergencyType === "other" && !customIssue)
    throw new ApiError(400, "Custom issue required for type 'other'");

  const sender = await User.findById(senderId);
  if (!sender?.location?.coordinates)
    throw new ApiError(400, "Sender location missing");

  const [lng, lat] = sender.location.coordinates;
  const address = await geocode(lat, lng);

  const emergency = await Emergency.create({
    sender: senderId,
    emergencyType,
    customIssue: emergencyType === "other" ? customIssue : undefined,
    description,
    location: { type: "Point", coordinates: [lng, lat] },
    address,
    priority: priority || "medium",
  });

  // notify 2 km neighbors
  const nearby = await User.find({
    location: {
      $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: 2000 },
    },
    _id: { $ne: senderId },
  }).select("_id");

  const io = getSocketInstance();
  nearby.forEach((u) =>
    io.to(u._id.toString()).emit("emergency_alert", {
      emergency,
      message: `${emergencyType.toUpperCase()} nearby`,
    })
  );

  res
    .status(201)
    .json(new ApiResponse(201, { emergency, notifiedUsers: nearby.length }));
});

/* ---------- accept emergency ---------- */
export const acceptEmergency = asyncHandler(async (req, res) => {
  const { emergencyId } = req.params;
  const acceptorId = req.user._id;

  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) throw new ApiError(404, "Not found");
  if (emergency.status !== "pending")
    throw new ApiError(400, "Already accepted / closed");
  if (emergency.sender.toString() === acceptorId.toString())
    throw new ApiError(400, "Cannot accept your own emergency");

  emergency.status = "accepted";
  emergency.acceptedBy = acceptorId;
  emergency.acceptedAt = new Date();
  await emergency.save();

  const acceptor = await User.findById(acceptorId);
  const sender = await User.findById(emergency.sender);

  const route = {
    from: acceptor.location.coordinates,
    to: emergency.location.coordinates,
  };

  getSocketInstance()
    .to(emergency.sender.toString())
    .emit("emergency_accepted", {
      emergency,
      acceptor: { fullName: acceptor.fullName, contactNumber: acceptor.contactNumber },
    });

  res.status(200).json(new ApiResponse(200, { emergency, route }));
});

/* ---------- list emergencies helpers kept same as earlier ---------- */
export const getNearbyEmergencies = asyncHandler(async (req, res) => {
  const { maxDistance = 2000 } = req.query;
  const me = await User.findById(req.user._id);
  const [lng, lat] = me.location.coordinates;

  const list = await Emergency.find({
    location: {
      $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: +maxDistance },
    },
    sender: { $ne: req.user._id },
    status: "pending",
    isActive: true,
  }).populate("sender", "fullName avatar contactNumber");

  res.status(200).json(new ApiResponse(200, list));
});

/* ---------- update emergency status ---------- */
export const updateEmergencyStatus = asyncHandler(async (req, res) => {
  const { emergencyId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  // Validate status
  const validStatuses = ['pending', 'accepted', 'resolved', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status. Must be one of: pending, accepted, resolved, cancelled");
  }

  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) {
    throw new ApiError(404, "Emergency not found");
  }

  // Check if user is authorized to update
  const isAuthorized = emergency.sender.toString() === userId.toString() || 
                      emergency.acceptedBy?.toString() === userId.toString();

  if (!isAuthorized) {
    throw new ApiError(403, "Not authorized to update this emergency");
  }

  // Prevent invalid status transitions
  if (emergency.status === 'resolved' && status !== 'resolved') {
    throw new ApiError(400, "Cannot change status of resolved emergency");
  }

  if (emergency.status === 'cancelled' && status !== 'cancelled') {
    throw new ApiError(400, "Cannot change status of cancelled emergency");
  }

  // Update status and timestamps
  const oldStatus = emergency.status;
  emergency.status = status;

  if (status === 'resolved' && oldStatus !== 'resolved') {
    emergency.resolvedAt = new Date();
  }

  if (status === 'cancelled' && oldStatus !== 'cancelled') {
    emergency.isActive = false;
  }

  await emergency.save();

  // Get user details for notifications
  const updatingUser = await User.findById(userId).select('fullName');

  // Send socket notifications to relevant users
  try {
    const io = getSocketInstance();
    
    const notificationData = {
      emergency,
      message: `Emergency status updated to: ${status}`,
      updatedBy: updatingUser.fullName,
      timestamp: new Date()
    };

    // Notify sender if update is from acceptor
    if (emergency.sender.toString() !== userId.toString()) {
      io.to(emergency.sender.toString()).emit('emergency_status_update', notificationData);
    }

    // Notify acceptor if update is from sender
    if (emergency.acceptedBy && emergency.acceptedBy.toString() !== userId.toString()) {
      io.to(emergency.acceptedBy.toString()).emit('emergency_status_update', notificationData);
    }
  } catch (socketError) {
    console.error('Socket notification error:', socketError);
    // Continue without socket notifications if there's an error
  }

  // Populate the response
  const updatedEmergency = await Emergency.findById(emergencyId)
    .populate('sender', 'fullName username avatar contactNumber')
    .populate('acceptedBy', 'fullName username avatar contactNumber');

  res.status(200).json(
    new ApiResponse(200, updatedEmergency, `Emergency status updated to ${status} successfully`)
  );
});

/* ---------- get emergency by ID ---------- */
export const getEmergencyById = asyncHandler(async (req, res) => {
  const { emergencyId } = req.params;
  const userId = req.user._id;

  const emergency = await Emergency.findById(emergencyId)
    .populate('sender', 'fullName username avatar contactNumber')
    .populate('acceptedBy', 'fullName username avatar contactNumber');

  if (!emergency) {
    throw new ApiError(404, "Emergency not found");
  }

  // Check if user has access to this emergency
  const hasAccess = emergency.sender.toString() === userId.toString() || 
                   emergency.acceptedBy?.toString() === userId.toString() ||
                   emergency.status === 'pending'; // Allow viewing pending emergencies

  if (!hasAccess) {
    throw new ApiError(403, "Not authorized to view this emergency");
  }

  res.status(200).json(
    new ApiResponse(200, emergency, "Emergency details fetched successfully")
  );
});

/* ---------- get user's emergencies ---------- */
export const getUserEmergencies = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, type, page = 1, limit = 10 } = req.query;

  const query = {
    $or: [
      { sender: userId },
      { acceptedBy: userId }
    ]
  };

  if (status && status !== 'all') {
    query.status = status;
  }

  if (type && type !== 'all') {
    query.emergencyType = type;
  }

  const skip = (page - 1) * limit;

  const emergencies = await Emergency.find(query)
    .populate('sender', 'fullName username avatar contactNumber')
    .populate('acceptedBy', 'fullName username avatar contactNumber')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Emergency.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      emergencies,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    }, "User emergencies fetched successfully")
  );
});
