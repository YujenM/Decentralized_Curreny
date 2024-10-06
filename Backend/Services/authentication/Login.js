const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../Database/ConnectDb');
const JWT_Secret_key = process.env.SECRET_KEY;

const userlogin = async (identifier, password) => {
    let loginquery;
    let params;

    if (identifier.includes('@')) {
        loginquery = "SELECT User_ID, User_Password FROM Users WHERE User_Email = ?";
        params = [identifier];
    } else {
        loginquery = "SELECT User_ID, User_Password FROM Users WHERE User_Name = ?";
        params = [identifier];
    }

    try {
        const searchresult = await db.getquery(loginquery, params);
        if (searchresult.length === 0) {
            throw new Error("Invalid Credentials");
        }

        const isMatch = await bcrypt.compare(password, searchresult[0].User_Password);
        if (!isMatch) {
            throw new Error("Invalid Credentials");
        }

        const token = jwt.sign({ User_ID: searchresult[0].User_ID }, JWT_Secret_key);
        return {
            token,
            user_id: searchresult[0].User_ID,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};



module.exports = { userlogin };
