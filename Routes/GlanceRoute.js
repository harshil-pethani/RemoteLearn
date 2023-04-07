import { Router } from 'express';
import { glanceCreate, glanceGet, glanceUpdate } from '../Controllers/GlanceController.js';
const router = Router();
import VerifyToken from "../Helper/VerifyToken.js";

router.post("/create", VerifyToken, glanceCreate.validator, glanceCreate.controller);

router.put("/update/:id", VerifyToken, glanceUpdate.validator, glanceUpdate.controller);

router.get("/", glanceGet);

export default router;