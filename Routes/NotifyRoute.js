import { Router } from 'express';
import { notifyCreate, getAllNotify } from '../Controllers/NotificationController.js';
import VerifyToken from '../Helper/VerifyToken.js';
const router = Router();

router.post("/create", notifyCreate.validator, notifyCreate.controller);

router.get("/findall", VerifyToken, getAllNotify.controller);

export default router;