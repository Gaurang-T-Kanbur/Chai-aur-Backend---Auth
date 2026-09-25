import ApiError from "../../common/errors/api.error.js";
import PasswordUtil from "../../common/utils/password.utils.js";
import JWTUtil from "../../common/utils/token.util.js";
import User from "./auth.model.js";

export function greet(name) {
  return `Hello ${name ?? "Sir"}`;
}

class AuthService {
  static register = async (data) => {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      throw ApiError.conflict("Email already exists!");
      return;
    }
    const { verificationToken, hashedVerificationToken } =
      JWTUtil.generateVerificationToken();
    let userData = {
      ...data,
      password: await PasswordUtil.hash(data.password),
      verificationTokenHash: hashedVerificationToken,
      verificationTokenExpires: Date.now() + 9 * 60 * 60 * 1000,
    };
    const user = await User.create(userData);

    console.log("====================================");
    console.log(user);
    console.log("====================================");

    return {
      username: user.username,
      email: user.email,
      verificationToken
    };
  };

  static login = async (data) => {
    let primaryField;
    if (data.username) {
      primaryField = "username";
    } else {
      primaryField = "email";
    }

    let user = await User.findOne({
      [primaryField]: data[primaryField],
    }).select("+password");

    if (!user) {
      throw ApiError.unauthorized("Invalid email/username or password");
      return;
    }

    if (!(await PasswordUtil.compare(data.password, user.password))) {
      throw ApiError.unauthorized("Invalid email/username or password");
      return;
    }

    if (!user.isVerified) {
      throw ApiError.forbidden("Please verify your account!");
      return;
    }

    const userId = user._id.toString();

    const accessToken = JWTUtil.createToken({ userId, role: user.role }, "9m");
    const { refreshToken, hashedRefreshToken } = JWTUtil.generateRefreshToken(
      { userId },
      "9d",
    );
    user.refreshTokenHash = hashedRefreshToken;
    console.log("====================================");
    console.log(user.refreshTokenHash);
    console.log("====================================");
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return {
      username: userObj.username,
      email: userObj.email,
      accessToken,
      refreshToken,
    };
  };

  static async profileService(userData) {
    const user = await User.findById(userData.userId);

    if (!user) {
      throw ApiError.notFound("User not found!");
    }

    return {
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  static async refreshService(refreshToken) {
    const tokenStatusObj = JWTUtil.verifyToken(refreshToken);
    let refreshTokenData;

    if (tokenStatusObj.success) {
      refreshTokenData = tokenStatusObj.data;
    } else {
      throw ApiError.unauthorized(tokenStatusObj.error);
    }

    const user = await User.findById(refreshTokenData.userId).select(
      "+refreshTokenHash",
    );

    if (!user) {
      throw ApiError.notFound("User not found!");
    }

    const hashCompareToken = JWTUtil.hashToken(refreshToken);

    if (hashCompareToken !== user.refreshTokenHash) {
      throw ApiError.forbidden("Invalid Refresh Token");
    }

    const accessToken = JWTUtil.createToken(
      { userId: refreshTokenData.userId, role: user.role },
      "9m",
    );

    const {
      refreshToken: newRefreshToken,
      hashedRefreshToken: hashedNewRefreshToken,
    } = JWTUtil.generateRefreshToken({ userId: refreshTokenData.userId }, "9d");

    user.refreshTokenHash = hashedNewRefreshToken;
    // console.log("hashedRefreshToken:", hashedNewRefreshToken);
    // console.log("refreshToken:", newRefreshToken);
    // console.log("userRefreshToken:", user.refreshTokenHash)
    await user.save();

    return {
      username: user.username,
      email: user.email,
      accessToken,
      newRefreshToken,
    };
  }

  static async verifyService(verifyToken) {
    if (!verifyToken) {
      throw ApiError.badRequest("Verification token is required");
    }

    const user = await User.findOne({
      verificationTokenHash: JWTUtil.hashToken(verifyToken),
    }).select("+verificationTokenExpires");

    if (!user) {
      throw ApiError.unauthorized("Invalid verification token");
    }

    if (new Date() > user.verificationTokenExpires) {
      throw ApiError.unauthorized("Verification Token Expired");
    } else {
      user.isVerified = true;
      user.verificationTokenHash = undefined;
      user.verificationTokenExpires = undefined;
    }

    await user.save();

    return {
      verified: true,
      userId: user._id.toString(),
      username: user.username,
    };
  }

  static async logoutService(userData) {
    const user = await User.findById(userData.userId);

    if (!user) {
      throw ApiError.notFound("User not found!");
    }

    user.refreshTokenHash = undefined;
    await user.save();

    return {
      Logout: true,
      message: "User logged Out successfully!",
    };
  }

  static async resendVerificationService(tokenEmail) {
    const user = await User.findOne({ email: tokenEmail });

    if (!user) {
      throw ApiError.notFound("User not found!");
    }

    if (user.isVerified) {
      throw ApiError.badRequest("Email is already verified");
    }

    const { verificationToken, hashedVerificationToken } =
      JWTUtil.generateVerificationToken();

    user.verificationTokenHash = hashedVerificationToken;
    user.verificationTokenExpires = Date.now() + 9 * 60 * 60 * 1000;
    await user.save();

    return {
      email: user.email,
      verificationToken,
    };
  }

  static async forgotPasswordService(email) {
    const user = await User.findOne({email});

     if (!user) {
      return
    }

    const {resetToken, hashedResetToken } = JWTUtil.generateResetToken()

    user.resetTokenHash = hashedResetToken;
    user.resetTokenExpires = Date.now() + 1 * 60 * 60 * 1000;
    await user.save();

    return {
      
        resetRequested: true,
        resetToken

      }


  }

  static async resetPasswordService(resetToken, newPassword) {

    const hashedToken = JWTUtil.hashToken(resetToken);

    const user = await User.findOne({resetTokenHash: hashedToken});

   if (!user) {
  throw ApiError.unauthorized("Invalid Reset Token");
}

    if(new Date() > user.resetTokenExpires) {
     throw ApiError.unauthorized("Invalid Reset Token"); 
    }

    const hashedPassword = await PasswordUtil.hash(newPassword);

    user.password = hashedPassword;

    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.refreshTokenHash = undefined;

    await user.save();

    return {success: true}

  }
}

export default AuthService;
