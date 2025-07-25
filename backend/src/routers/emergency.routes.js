import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEmergency,
  acceptEmergency,
  getNearbyEmergencies,
  updateEmergencyStatus,  // Add this
  getEmergencyById,       // Add this
  getUserEmergencies      // Add this
} from "../controllers/emergency.controller.js";

const router = Router();
router.use(verifyJWT);

router.post("/create", createEmergency);
router.post("/accept/:emergencyId", acceptEmergency);
router.get("/nearby", getNearbyEmergencies);

// Add these new routes
router.patch("/update-status/:emergencyId", updateEmergencyStatus);
router.get("/my-emergencies", getUserEmergencies);
router.get("/:emergencyId", getEmergencyById);

export default router;
