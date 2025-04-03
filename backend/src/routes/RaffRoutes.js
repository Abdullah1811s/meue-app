import express from 'express';
import {
    getAllRaff,
    getCompletedRaff,
    getScheduledRaff,
    makeNewRaff,
    toggleVisibility,
    updateRaffWithWinner,
    updateRaffleOfferings,
    delRef,
    deleteRafflesByVendor
} from '../controllers/RaffController.js';
import { authenticate, authorization } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllRaff);
router.get('/ready', getCompletedRaff);
router.get('/notReady', getScheduledRaff);
router.post('/createRaff', authenticate, authorization(["admin" , "superadmin"]), makeNewRaff);
router.put('/changeVisibility', (req, res) => {
    if (!req.app.locals.io) {
        return res.status(500).json({ error: "Socket.IO not available" });
    }
    return toggleVisibility(req, res, req.app.locals.io);
});
router.put('/updateRaff', updateRaffWithWinner);
router.put('/updateOfferings/:id', updateRaffleOfferings);
router.delete('/remove/:id', authenticate, authorization(["admin" , "superadmin"]), deleteRafflesByVendor);
router.delete('/delRaff', authenticate, authorization(["admin" , "superadmin"]), delRef);

export default router;