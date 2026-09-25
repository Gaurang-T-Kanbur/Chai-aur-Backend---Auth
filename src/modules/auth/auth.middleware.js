import ApiError from "../../common/errors/api.error.js";
import JWTUtil from "../../common/utils/token.util.js";

export const greetMiddleware = (req, res, next) => {
    if(!req.query.name) {
        const error = new Error("Name is required")
        error.statusCode = 400
        return next(error)

    }
    req.name = req.query.name
    next()
}



export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return next(ApiError.unauthorized("Not Authorized"))
    }

    const tokenFormat = authHeader.split(" ")
    const token = tokenFormat[1];

    if(tokenFormat[0] === 'Bearer' && token) {
        const statusObj = JWTUtil.verifyToken(token);

        if(statusObj.success) {
            req.user = statusObj.data
            return next()
        } else {
             return next(ApiError.unauthorized(statusObj.error))  
        }
    } else {
        return next(ApiError.unauthorized("Not Authorized"))  
    }
 

}

