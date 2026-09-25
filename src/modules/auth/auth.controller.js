import AuthService, { greet } from "./auth.service.js"
import ApiResponse from "../../common/responses/api.response.js"

const greetController = 
    (req, res) => {
    ApiResponse.success(res, "Greeted User", greet(req.name))
}

const registerController = async (req, res) => {
   const user =  await AuthService.register(req.body);

     ApiResponse.success(res, "User Created!", user )
}

const loginController = async(req, res) => {
    const validData = await AuthService.login(req.body);

    ApiResponse.success(res, "Login successful!", validData)
}

const profileController = async(req, res) => {
    const getProfile = await AuthService.profileService(req.user);

    ApiResponse.success(res, "User Authenticated", getProfile)
}

const refreshController = async(req, res) => {
    const tokenData = await AuthService.refreshService(req.body.refreshToken);

    ApiResponse.success(res, "New Access and Refresh Token sent!", tokenData)
}

const verifyController = async (req, res) => {
    const verifyToken = req.query.token;

    let verifyStatusData = await AuthService.verifyService(verifyToken);
    
    ApiResponse.success(res, "User Verified successfully!", verifyStatusData)

}

const logoutController = async (req, res) => {
     const accessTokenData = req.user
    const userLoggedStatus = await AuthService.logoutService(accessTokenData);

    ApiResponse.success(res, "User Logged Out!", userLoggedStatus)
}

const resendVerificationController = async (req, res) => {
     const tokenEmail = req.body.email;
    const resendVerificationStatus = await AuthService.resendVerificationService(tokenEmail);
    

    ApiResponse.success(res, "Verification Token Sent", resendVerificationStatus)
}

const verificationController = async (req, res) => {
     const verifyToken = req.query.token;
    const verificationStatus = await AuthService.verifyService(verifyToken);
    

    ApiResponse.success(res, "User Verified Successfully", verificationStatus)
}


const forgotPasswordController = async (req, res) => {

    const checkEmail = req.body.email;
    const resetPasswordStatus = await AuthService.forgotPasswordService(checkEmail);
     ApiResponse.success(res, "If the account exists, reset instructions have been sent.", resetPasswordStatus)
    
}

const resetPasswordController = async (req, res) => {

    const resetToken = req.body.resetToken;
    const newPassword = req.body.newPassword
    const resetPasswordStatus = await AuthService.resetPasswordService(resetToken, newPassword);
     ApiResponse.success(res, "Password reset successfully. Please login again", resetPasswordStatus)
    
}





export {
        greetController, 
        registerController, 
        loginController, 
        profileController, 
        refreshController, 
        logoutController, 
        resendVerificationController,
        verificationController,
        forgotPasswordController,
        resetPasswordController

}