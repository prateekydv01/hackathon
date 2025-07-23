import { Emergency } from "../models/emergency.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Emergency Alert
const createEmergency = asyncHandler(async (req, res) => {
    const { emergencyType, customDescription, severity, coordinates, address } = req.body;
    
    if (!coordinates || coordinates.length !== 2) {
        throw new ApiError(400, "Valid coordinates are required");
    }

    const emergency = await Emergency.create({
        userId: req.user._id,
        emergencyType,
        customDescription,
        severity,
        location: {
            type: "Point",
            coordinates: coordinates // [longitude, latitude]
        },
        address
    });

    // Find all users within 2km radius (excluding emergency creator)
    const nearbyUsers = await User.find({
        _id: { $ne: req.user._id },
        location: {
            $geoWithin: {
                $centerSphere: [
                    coordinates,
                    2 / 6378.137 // 2km in radians
                ]
            }
        }
    }).select('_id fullName contactNumber avatar');

    // Update emergency with notified users
    emergency.notifiedUsers = nearbyUsers.map(user => user._id);
    await emergency.save();

    // Populate emergency data for response
    const populatedEmergency = await Emergency.findById(emergency._id)
        .populate('userId', 'fullName contactNumber avatar');

    // Simple notification data (you can implement Socket.IO or push notifications later)
    const notificationData = {
        emergencyId: emergency._id,
        type: emergencyType,
        description: customDescription || getEmergencyTypeDescription(emergencyType),
        severity,
        userInfo: {
            name: req.user.fullName,
            contact: req.user.contactNumber,
            avatar: req.user.avatar
        },
        location: {
            coordinates,
            address
        },
        timestamp: emergency.createdAt,
        notifiedUsersCount: nearbyUsers.length
    };

    res.status(201).json(
        new ApiResponse(201, {
            emergency: populatedEmergency,
            notifications: notificationData
        }, `Emergency alert created and ${nearbyUsers.length} users notified`)
    );
});

// Accept Emergency Response
const acceptEmergencyResponse = asyncHandler(async (req, res) => {
    const { emergencyId } = req.params;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
        throw new ApiError(404, "Emergency not found");
    }

    if (emergency.status !== 'active') {
        throw new ApiError(400, "Emergency is no longer active");
    }

    // Check if user was notified about this emergency
    const wasNotified = emergency.notifiedUsers.includes(req.user._id);
    if (!wasNotified) {
        throw new ApiError(403, "You were not notified about this emergency");
    }

    // Check if user already accepted
    const alreadyAccepted = emergency.respondersAccepted.some(
        responder => responder.userId.toString() === req.user._id.toString()
    );

    if (alreadyAccepted) {
        throw new ApiError(400, "You have already accepted this emergency");
    }

    // Add responder
    emergency.respondersAccepted.push({
        userId: req.user._id
    });

    // Update status if this is the first responder
    if (emergency.respondersAccepted.length === 1) {
        emergency.status = 'in_progress';
    }

    await emergency.save();

    const updatedEmergency = await Emergency.findById(emergencyId)
        .populate('userId', 'fullName contactNumber')
        .populate('respondersAccepted.userId', 'fullName avatar contactNumber');

    res.status(200).json(
        new ApiResponse(200, updatedEmergency, "Emergency response accepted")
    );
});

// Get Route to Emergency Location
const getEmergencyRoute = asyncHandler(async (req, res) => {
    const { emergencyId } = req.params;
    
    const emergency = await Emergency.findById(emergencyId)
        .populate('userId', 'fullName contactNumber avatar');
    
    if (!emergency) {
        throw new ApiError(404, "Emergency not found");
    }

    // Check if user is a responder
    const isResponder = emergency.respondersAccepted.some(
        responder => responder.userId.toString() === req.user._id.toString()
    );

    if (!isResponder) {
        throw new ApiError(403, "You must accept the emergency first to get route");
    }

    const routeData = {
        destination: {
            coordinates: emergency.location.coordinates,
            address: emergency.address
        },
        emergencyDetails: {
            type: emergency.emergencyType,
            severity: emergency.severity,
            description: emergency.customDescription || getEmergencyTypeDescription(emergency.emergencyType),
            createdAt: emergency.createdAt
        },
        contactInfo: {
            name: emergency.userId.fullName,
            phone: emergency.userId.contactNumber,
            avatar: emergency.userId.avatar
        }
    };

    res.status(200).json(
        new ApiResponse(200, routeData, "Emergency route data retrieved")
    );
});

// Get Nearby Active Emergencies
const getNearbyEmergencies = asyncHandler(async (req, res) => {
    const { coordinates, radius = 2 } = req.query;
    
    if (!coordinates) {
        throw new ApiError(400, "Coordinates are required");
    }

    const coords = coordinates.split(',').map(Number);
    
    const emergencies = await Emergency.find({
        status: { $in: ['active', 'in_progress'] },
        location: {
            $geoWithin: {
                $centerSphere: [coords, radius / 6378.137]
            }
        }
    })
    .populate('userId', 'fullName avatar')
    .populate('respondersAccepted.userId', 'fullName')
    .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, emergencies, "Nearby emergencies retrieved")
    );
});

// Get User's Emergency History
const getUserEmergencies = asyncHandler(async (req, res) => {
    const emergencies = await Emergency.find({
        userId: req.user._id
    })
    .populate('respondersAccepted.userId', 'fullName avatar')
    .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, emergencies, "User emergencies retrieved")
    );
});

// Update Emergency Status (for emergency creator)
const updateEmergencyStatus = asyncHandler(async (req, res) => {
    const { emergencyId } = req.params;
    const { status } = req.body;

    const emergency = await Emergency.findOne({
        _id: emergencyId,
        userId: req.user._id
    });

    if (!emergency) {
        throw new ApiError(404, "Emergency not found or you're not authorized");
    }

    emergency.status = status;
    await emergency.save();

    res.status(200).json(
        new ApiResponse(200, emergency, "Emergency status updated")
    );
});

// Helper Functions
const getEmergencyTypeDescription = (type) => {
    const descriptions = {
        health: "Medical Emergency",
        accident: "Accident Occurred", 
        fire: "Fire Emergency",
        security: "Security Threat",
        natural_disaster: "Natural Disaster"
    };
    return descriptions[type] || "Emergency Situation";
};

export {
    createEmergency,
    acceptEmergencyResponse,
    getEmergencyRoute,
    getNearbyEmergencies,
    getUserEmergencies,
    updateEmergencyStatus
};
