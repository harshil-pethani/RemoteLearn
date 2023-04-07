import { Router } from 'express';
import { deleteSingleQuizData, getAllQuizes, getSingleQuizData, QuizCreate } from '../Controllers/QuizController.js';
const router = Router();
import VerifyToken from "../Helper/VerifyToken.js";


router.post("/create", QuizCreate.validator, QuizCreate.controller);

router.get("/find/:id", VerifyToken, getSingleQuizData.validator, getSingleQuizData.controller);

router.get("/findall", VerifyToken, getAllQuizes.controller);

router.delete("/delete/:id", VerifyToken, deleteSingleQuizData.validator, deleteSingleQuizData.controller);

export default router;