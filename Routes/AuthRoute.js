import { Router } from 'express';
import { login, register, checkAdmin, updateAdmin, updateAdminPassword, logout, forgotPassword, resetTokenVerify, resetPassword, getAllAdmins, deleteAdmin } from '../Controllers/AuthController.js';
import VerifyToken from '../Helper/VerifyToken.js';

const router = Router();

router.post("/register", VerifyToken, register.validator, register.controller);
router.post("/login", login.validator, login.controller);
router.get("/logout", logout.controller);

router.get("/checkadmin", VerifyToken, checkAdmin.controller);

router.post("/updatedata", VerifyToken, updateAdmin.validator, updateAdmin.controller);

router.post("/updatepassword", VerifyToken, updateAdminPassword.validator, updateAdminPassword.controller);

router.get("/alladmin", VerifyToken, getAllAdmins.controller);

// router.put("/adminstatus/:id", VerifyToken, updateAdminStatus.validator, updateAdminStatus.controller);
router.delete("/deleteadmin/:id", VerifyToken, deleteAdmin.validator, deleteAdmin.controller);

router.post("/forgotpassword", forgotPassword.validator, forgotPassword.controller);

router.post("/reset_token_verify", resetTokenVerify.validator, resetTokenVerify.controller);

router.put("/resetpassword", resetPassword.validator, resetPassword.controller);

export default router;