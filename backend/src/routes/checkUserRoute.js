import express from 'express'
import { checkForExistingUser } from '../utils/checkForExistingUser.js';
const router = express.Router();
router.post('/', checkForExistingUser);
export default router;
