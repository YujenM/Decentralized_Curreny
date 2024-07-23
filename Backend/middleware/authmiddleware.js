const bcrypt = require('bcrypt');

const generateHashPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        req.body.password = hashedPassword;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = generateHashPassword;