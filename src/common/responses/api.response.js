class ApiResponse {
 static success(res, message, data=null) {
    res.status(201)
        .json({
            success: true,
            message,
            data
        })
 }
}

export default ApiResponse