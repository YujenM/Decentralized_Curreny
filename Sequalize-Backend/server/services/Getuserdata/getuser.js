const {User}=require('../../models');
// const httpstatus = require('http-status');
module.exports = async (userId) => {
    try {
        const user = await User.findOne({
            where: { id: userId } // userId should be a number or string
        });

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(error.message); // Return a clear error message
    }
};