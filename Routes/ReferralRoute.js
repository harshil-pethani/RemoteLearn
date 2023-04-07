import { Router } from 'express';
import { checkReferral, getFinalPrice, getReferralCode } from '../Controllers/ReferralController.js';
const router = Router();


router.post("/getcode", getReferralCode.validator, getReferralCode.controller);

router.post("/check", checkReferral.validator, checkReferral.controller);

router.post("/getfinalprice", getFinalPrice.validator, getFinalPrice.controller);

// router.post("/addreferral", addReferral.validator, addReferral.controller);

// router.post("/usecredits", useCredits.validator, useCredits.controller);


export default router;