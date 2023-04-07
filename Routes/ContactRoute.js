import { Router } from 'express';
import { submitContact } from '../Controllers/ContactController.js';
const router = Router();

router.post("/submitform", submitContact.validator, submitContact.controller);

export default router;