import ApiError from "../errors/api.error.js";

const validate = (DtoClass) => {
   return (req, res, next) => {
        const {errors, value} = DtoClass.validate(req.body);
        if(errors) {
            return next(ApiError.badRequest(errors.join('; ')))
        }

        req.body = value;
        next()
    }
}

export default validate