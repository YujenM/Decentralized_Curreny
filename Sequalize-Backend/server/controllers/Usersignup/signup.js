const httpStatus = require('http-status');
const userservice=require('../../services/usersignup');
const ValidationError = require("../../errors/validation");

module.exports = async (req, res, next) => {
    try {
        const usersignup = await userservice.signupservices(req.body);
        res.status(httpStatus.OK).json({
            message: "success",
            data: usersignup
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // If it's a validation error, return a 400 Bad Request status
            res.status(httpStatus.BAD_REQUEST).json({
                message: error.message
            });
        } else {
            // For other types of errors, log and pass them to the next middleware
            console.log("Error:", error);
            next(error);
        }
    }
}

