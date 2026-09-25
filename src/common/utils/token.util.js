import jwt from "jsonwebtoken";
import env from "../config/env.js";
import crypto from 'crypto'

class JWTUtil {
  static  createToken(payload,  expiryTime) {
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${expiryTime}` });

    return token;
  }

  static  verifyToken(token) {
    try {
      // Decodes and validates the token using your secret key
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // If successful, returns the original payload data
      return { success: true, data: decoded };
    } catch (error) {
      // Throws an error if expired, malformed, or tampered with
      return { success: false, error: error.message };
    }
  }
 
  static hashToken (token) {
    return crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
  }
  static generateRefreshToken (payload, expiryTime) {
    const refreshToken = this.createToken(payload, expiryTime);

    const hashedRefreshToken = this.hashToken(refreshToken)

    return {refreshToken, hashedRefreshToken}

  }

  static generateVerificationToken () {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const hashedVerificationToken = this.hashToken(verificationToken)

    return {verificationToken, hashedVerificationToken}
  }

  static generateResetToken () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedResetToken = this.hashToken(resetToken)

    return {resetToken, hashedResetToken}
  }
}



export default JWTUtil
