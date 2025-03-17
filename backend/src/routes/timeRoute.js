import express from "express";
import { getMainWebTime, getAppTime, setTimeData } from "../controllers/timeController.js";

const router = express.Router();

router.get("/mainWebTime", getMainWebTime);

router.get("/appTime", getAppTime);
// Add or update time data
router.post("/setTime", setTimeData);

export default router;
