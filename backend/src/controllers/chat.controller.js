// controllers/chat.controller.js
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get or create chat between two users
const getOrCreateChat = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
        throw new ApiError(400, "Cannot chat with yourself");
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
        participants: { $all: [req.user._id, userId] }
    }).populate('participants', 'fullName username avatar');

    // Create new chat if doesn't exist
    if (!chat) {
        chat = await Chat.create({
            participants: [req.user._id, userId]
        });
        
        chat = await Chat.findById(chat._id)
            .populate('participants', 'fullName username avatar');
    }

    res.status(200).json(
        new ApiResponse(200, chat, "Chat retrieved successfully")
    );
});

// Get all user chats
const getUserChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({
        participants: req.user._id
    })
    .populate('participants', 'fullName username avatar')
    .sort({ lastMessageTime: -1 });

    // Add unread count for each chat
    const chatsWithUnread = chats.map(chat => {
        const unreadCount = chat.messages.filter(msg => 
            !msg.senderId.equals(req.user._id) && !msg.isRead
        ).length;

        const otherUser = chat.participants.find(p => 
            !p._id.equals(req.user._id)
        );

        return {
            _id: chat._id,
            otherUser,
            lastMessage: chat.lastMessage,
            lastMessageTime: chat.lastMessageTime,
            unreadCount
        };
    });

    res.status(200).json(
        new ApiResponse(200, chatsWithUnread, "Chats retrieved successfully")
    );
});

// Send message
const sendMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content.trim()) {
        throw new ApiError(400, "Message content is required");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user._id)) {
        throw new ApiError(403, "You are not part of this chat");
    }

    // Add message to chat
    const newMessage = {
        senderId: req.user._id,
        content: content.trim(),
        isRead: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content.trim();
    chat.lastMessageTime = new Date();
    
    await chat.save();

    // Get the created message with sender info
    const savedMessage = chat.messages[chat.messages.length - 1];
    await Chat.populate(savedMessage, {
        path: 'senderId',
        select: 'fullName username avatar'
    });

    res.status(201).json(
        new ApiResponse(201, savedMessage, "Message sent successfully")
    );
});

// Get chat messages
const getChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
        .populate('messages.senderId', 'fullName username avatar')
        .populate('participants', 'fullName username avatar');

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.equals(req.user._id))) {
        throw new ApiError(403, "You are not part of this chat");
    }

    // Mark messages as read
    const unreadMessages = chat.messages.filter(msg => 
        !msg.senderId.equals(req.user._id) && !msg.isRead
    );

    unreadMessages.forEach(msg => {
        msg.isRead = true;
    });

    if (unreadMessages.length > 0) {
        await chat.save();
    }

    // Pagination
    const skip = (page - 1) * limit;
    const messages = chat.messages
        .slice(-skip - parseInt(limit), chat.messages.length - skip)
        .reverse();

    const otherUser = chat.participants.find(p => !p._id.equals(req.user._id));

    res.status(200).json(
        new ApiResponse(200, {
            messages,
            otherUser,
            hasMore: skip + messages.length < chat.messages.length
        }, "Messages retrieved successfully")
    );
});

export {
    getOrCreateChat,
    getUserChats,
    sendMessage,
    getChatMessages
};
