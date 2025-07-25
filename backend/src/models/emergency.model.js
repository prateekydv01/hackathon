import mongoose, { Schema } from "mongoose";

const emergencySchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },

    emergencyType: {
      type: String,
      enum: ["accident", "health", "fire", "theft", "other"],
      required: true,
    },

    customIssue: {
      type: String,
      required() {
        return this.emergencyType === "other";
      },
    },

    description: { type: String, required: true },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },

    address: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "resolved", "cancelled"],
      default: "pending",
    },

    acceptedBy: { type: Schema.Types.ObjectId, ref: "User" },
    acceptedAt: Date,
    resolvedAt: Date,

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

emergencySchema.index({ location: "2dsphere" });
export const Emergency = mongoose.model("Emergency", emergencySchema);
