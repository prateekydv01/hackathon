import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { changePassword, getAllUsers, getCurrentUser, getNearbyUser, getUserProfile, loginUser, logoutUser, registerUser, updateAccessToken, updateUserProfile } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(upload.single("avatar"),registerUser)
router.route("/login").post(loginUser)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-access-token").post(verifyJWT,updateAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/nearby-user").get(verifyJWT,getNearbyUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route("/update-profile").put(
    verifyJWT,
    upload.single("avatar"), // For avatar upload
    updateUserProfile
);
router.route("/profile/:userId").get(verifyJWT,getUserProfile);
router.route("/all").get(verifyJWT,getAllUsers);


export default router