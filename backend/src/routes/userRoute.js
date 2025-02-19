import express from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";

const router = express.Router();

// Route to get all users
router.get("/", getAllUsers);

// Route to get a user by ID
router.get("/:id", getUserById);

export default router;
