import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {



static schema = Joi.object({
    username: Joi.string().trim().min(5).max(27).required(),
    email: Joi.string().email().trim().lowercase().max(108).required(),
    password: Joi.string()
        .min(8).max(54)
        .message("Password must contain 8 chars minimum")
        .required(),
     role: Joi.string().valid("customer", "seller").default("customer"),
     isVerified: Joi.boolean().default(false)

});

}

console.log('====================================');
console.log(RegisterDto.validate({
    username: "  Gaurang  ",
    email: "  GAURANG@EXAMPLE.COM  ",
    password: "secret123"
}));
console.log('===================================='); 


export default RegisterDto