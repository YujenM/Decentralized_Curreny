const ValidationError = require("../../errors/validation");
const { User } = require('../../models');
const sequelize = require('sequelize');

module.exports = async (querobj) => {
    const user = await User.findOne({
        where: {
            [sequelize.Op.or]: [
                {
                    email: querobj.email || '',
                },
                {
                    fullName: querobj.fullName || '',
                }
            ]
        }
    });

    if (!user) {
        throw new ValidationError('User not found');
    }

    if (!user.validPassword(querobj.password)) {
        throw new ValidationError('Invalid password');
    }

    return { user };
};
