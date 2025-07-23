import { Router } from "express";
import {
    createEmergency,
    acceptEmergencyResponse,
    getEmergencyRoute,
    getNearbyEmergencies,
    getUserEmergencies,
    updateEmergencyStatus
} from "../controllers/emergency.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Emergency routes
router.route("/create").post(createEmergency);
router.route("/nearby").get(getNearbyEmergencies);
router.route("/my-emergencies").get(getUserEmergencies);
router.route("/:emergencyId/accept").post(acceptEmergencyResponse);
router.route("/:emergencyId/route").get(getEmergencyRoute);
router.route("/:emergencyId/status").put(updateEmergencyStatus);

export default router;
