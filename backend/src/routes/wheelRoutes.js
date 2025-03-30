import express from 'express'
import { getAllOnWheel, addVendorOnWheel, removeVendorFromWheel , updateWinner, updateVendorExclusiveOffer,delOffer , addWheelEntry } from '../controllers/wheelController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.get('/', getAllOnWheel);
router.post('/add', authenticate, authorization(['admin']), addVendorOnWheel);
router.post('/addAdmin', authenticate, authorization(['admin']), addWheelEntry);
router.put('/update', updateWinner);
router.delete('/remove', authenticate, authorization(['admin']), removeVendorFromWheel);
router.delete('/offers/:offerId', authenticate, authorization(['admin']), delOffer);
router.put('/:vendorId/exclusive-offer', updateVendorExclusiveOffer);
export default router;

