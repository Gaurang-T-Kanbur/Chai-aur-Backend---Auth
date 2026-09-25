import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class LoginDto extends BaseDto {
  static schema = Joi.object({
    username: Joi.string().trim().min(5).max(27),
    email: Joi.string().email().trim().lowercase().max(108),
    password: Joi.string()
      .min(8)
      .max(54)
      .message({
        "string.min": "Password must contain at least 8 characters",
        "string.max": "Password must not exceed 54 characters",
        "any.required": "Password is required",
      })
      .required(),
  }).xor("email", "username");
}

export default LoginDto;
