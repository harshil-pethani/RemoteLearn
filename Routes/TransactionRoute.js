import { Router } from 'express';
import { allTransactions } from '../Controllers/StudentController.js';
const router = Router();
import VerifyToken from "../Helper/VerifyToken.js";

router.get("/findall", VerifyToken, allTransactions.controller);

export default router;

