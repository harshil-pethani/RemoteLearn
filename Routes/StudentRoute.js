import { Router } from 'express';
import { allCustomer, deleteCustomer, sendBulkMailController } from '../Controllers/StudentController.js';
const router = Router();
import VerifyToken from "../Helper/VerifyToken.js";

// router.post("/create", customerAdd.validator, customerAdd.controller);
router.delete("/:id", VerifyToken, deleteCustomer.validator, deleteCustomer.controller);
router.get("/findall", VerifyToken, allCustomer.controller);
router.post("/sendbunkmail", VerifyToken, sendBulkMailController.validator, sendBulkMailController.controller);

export default router;