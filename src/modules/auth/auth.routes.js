import { Router } from "express";
import { forgotPasswordController, greetController, loginController, logoutController, profileController, refreshController, registerController, resendVerificationController, resetPasswordController, verificationController } from "./auth.controller.js";
import { authMiddleware, greetMiddleware } from "./auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";


const router = new Router;


router.get('/greet', greetMiddleware, greetController )

router.post('/register', validate(RegisterDto), registerController)
router.post('/login', validate(LoginDto), loginController)
router.get('/profile', authMiddleware, profileController)
router.get('/refresh', refreshController )
router.post('/resendEmail', resendVerificationController );
router.get('/verify', verificationController)
router.post("/logout", authMiddleware, logoutController)
router.post("/forgot-password", forgotPasswordController )
router.post("/reset-password", resetPasswordController)

export default router