import express from 'express'
import { getAllAffiliates, getAffiliateById, loginAffiliate, registerAffiliate } from '../controllers/affiliatedController.js'

const router = express.Router();
router.get("/get", getAffiliateById);
router.post("/login", loginAffiliate);
router.get("/affiliated", getAllAffiliates);
router.post("/register", registerAffiliate);


export default router;