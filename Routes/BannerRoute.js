import { Router } from 'express';
import { bannerCreate, bannerExpire, bannerUpdate, getActiveBanner, getAllBanners, getSingleBanner } from '../Controllers/BannerController.js';
const router = Router();
import VerifyToken from "../Helper/VerifyToken.js";


router.post("/create", VerifyToken, bannerCreate.validator, bannerCreate.controller);

router.get("/getallbanners", VerifyToken, getAllBanners.controller);

router.get("/find/:id", VerifyToken, getSingleBanner.validator, getSingleBanner.controller);

router.put("/update/:id", VerifyToken, bannerUpdate.validator, bannerUpdate.controller);


router.put("/expire/:id", VerifyToken, bannerExpire.validator, bannerExpire.controller);

router.get("/findactive", getActiveBanner.controller);

export default router;