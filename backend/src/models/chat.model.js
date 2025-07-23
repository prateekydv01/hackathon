// models/chat.model.js
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const chatSchema = new Schema(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        messages: [messageSchema],
        lastMessage: {
            type: String,
            default: ""
        },
        lastMessageTime: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Index for better performance
chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageTime: -1 });

export const Chat = mongoose.model("Chat", chatSchema);

