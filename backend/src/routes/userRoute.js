import express from "express";
import { getAllUsers, getUserById , incrementUserSpin , updatePoint } from "../controllers/userController.js";

const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

// Route to get a user by ID
router.get("/:id", getUserById);

router.put("/:id/increment-spin", incrementUserSpin);
router.put("/:id/increasePoint" , updatePoint);
export default router;
