const httpstatus = require('http-status');
const jwt = require('jsonwebtoken');
const loginservices = require('../../services/Userlogin');

module.exports = async (req, res, next) => {
    try {
        const { user } = await loginservices.login(req.body);
        
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.SECRET,
            {
                expiresIn: '2h',
            }
        );

        const { password, ...userWithoutPassword } = user.toJSON();

        res.status(httpstatus.OK).json({
            message: 'User Logged in successfully',
            user: userWithoutPassword,
            token,
        });

    } catch (err) {
        console.error('APIERROR', err.message); // Log the specific error message
        res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
            message: err.message || 'Internal server error',
        });
        next(err);
    }
};
