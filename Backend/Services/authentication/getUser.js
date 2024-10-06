const db = require('../../Database/ConnectDb');

const getUserById = async (userId) => {
    const userQuery = 'SELECT User_ID, User_Name, User_Email, created_at FROM Users WHERE user_id = ?';
    const results = await db.getquery(userQuery, [userId]);

    if (results.length === 0) {
        throw new Error("User not found");
    }

    return results[0];
};

module.exports = { getUserById };
