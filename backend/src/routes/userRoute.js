import express from "express";
import { getAllUsers, getUserById, incrementUserSpin, updatePoint, delUser } from "../controllers/userController.js";
import { authenticate, authorization } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);
router.delete('/del-user', authenticate, authorization(["admin" , "superadmin"]), delUser)
// Route to get a user by ID
router.get("/:id", getUserById);

router.put("/:id/increment-spin", incrementUserSpin);
router.put("/:id/increasePoint", updatePoint);
export default router;
