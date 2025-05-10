import express from 'express'
import { getAllOnWheel, addVendorOnWheel, removeVendorFromWheel , updateWinner, updateVendorExclusiveOffer,delOffer , addWheelEntry, updateVendorExclusiveOffer2 } from '../controllers/wheelController.js'
import { authenticate, authorization } from '../middlewares/authMiddleware.js'
const router = express.Router();
router.get('/', getAllOnWheel);
router.post('/add', authenticate, authorization(['admin' , "superadmin"]), addVendorOnWheel);
router.post('/addAdmin', authenticate, authorization(['admin',"superadmin"]), addWheelEntry);
router.put('/update', updateWinner);
router.delete('/remove', authenticate, authorization(['admin',"superadmin"]), removeVendorFromWheel);
router.delete('/offers/:offerId', authenticate, authorization(['admin',"superadmin"]), delOffer);
router.put('/:vendorId/exclusive-offer', updateVendorExclusiveOffer);

router.put('/:vendorId/exclusive-offer/update', updateVendorExclusiveOffer2);

export default router;

