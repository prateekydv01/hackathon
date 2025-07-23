import mongoose, { Schema } from "mongoose";

const emergencySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        emergencyType: {
            type: String,
            enum: ['health', 'accident', 'fire', 'security', 'natural_disaster', 'other'],
            required: true
        },
        customDescription: {
            type: String,
            required: function() {
                return this.emergencyType === 'other';
            },
            maxlength: 150
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'in_progress', 'resolved', 'cancelled'],
            default: 'active'
        },
        respondersAccepted: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            acceptedAt: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['on_way', 'arrived', 'helping'],
                default: 'on_way'
            }
        }],
        notifiedUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    { timestamps: true }
);

emergencySchema.index({ location: '2dsphere' });
emergencySchema.index({ status: 1, createdAt: -1 });

export const Emergency = mongoose.model("Emergency", emergencySchema);
