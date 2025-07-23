// routes/chat.routes.js
import { Router } from "express";
import {
    getOrCreateChat,
    getUserChats,
    sendMessage,
    getChatMessages
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply auth middleware
router.use(verifyJWT);

// Chat routes
router.route("/").get(getUserChats);
router.route("/:userId").get(getOrCreateChat);
router.route("/:chatId/messages").get(getChatMessages);
router.route("/:chatId/send").post(sendMessage);


export default router;
