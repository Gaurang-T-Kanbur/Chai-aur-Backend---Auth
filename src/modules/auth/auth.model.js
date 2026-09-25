import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 54,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationTokenHash: { type: String, select: false },
    verificationTokenExpires: { type: Date },
    refreshTokenHash: { type: String, select: false },
    resetTokenHash: {
      type: String,
      select: false,
    },
    resetTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
