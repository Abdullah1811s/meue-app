import express from 'express'
import { makeNewRaff, getCompletedRaff, getScheduledRaff, updateRaffWithWinner, delRef, getAllRaff , toggleVisibility ,updateRaffleOfferings } from '../controllers/RaffController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.get('/', getAllRaff)
router.get('/ready', getCompletedRaff)
router.get('/notReady', getScheduledRaff);
router.post('/createRaff', authenticate, authorization(["admin"]), makeNewRaff);
router.put('/changeVisibility',toggleVisibility);
router.put('/updateRaff', updateRaffWithWinner);
router.put('/updateOfferings/:id', updateRaffleOfferings); 
router.delete('/delRaff', authenticate, authorization(["admin"]), delRef);
export default router;       