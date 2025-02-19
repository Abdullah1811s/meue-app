import express from 'express'
import {Login , signUp} from "../controllers/authController.js"
const router = express.Router();
router.post('/signUp' , signUp);
router.post('/Login' , Login);
export default router;
