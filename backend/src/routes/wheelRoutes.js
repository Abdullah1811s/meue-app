import express from 'express'
import { getAllVendorOnWheel, addVendorOnWheel, removeVendorFromWheel , updateWinner, updateVendorExclusiveOffer,delOffer } from '../controllers/wheelController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.get('/', getAllVendorOnWheel);
router.post('/add', authenticate, authorization(['admin']), addVendorOnWheel);
router.put('/update', updateWinner);
router.delete('/remove', authenticate, authorization(['admin']), removeVendorFromWheel);
router.delete('/offers/:offerId', authenticate, authorization(['admin']), delOffer);
router.put('/:vendorId/exclusive-offer', updateVendorExclusiveOffer);
export default router;

