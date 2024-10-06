const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../Database/ConnectDb');
require('dotenv').config();

const JWT_Secret_key = process.env.SECRET_KEY;

const generaterandomnumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
}

const userSignup = async (username, email, password) => {
    let userId = '';
    let isunique = false;

    while (!isunique) {
        let randomnumber = generaterandomnumber();
        userId = `MARK-${randomnumber}`;
        
        const checkuseridquery = 'SELECT * FROM Users WHERE User_ID = ?';
        const checkuseridresults = await db.getquery(checkuseridquery, [userId]);
        
        if (checkuseridresults.length === 0) {
            isunique = true;
        }
    }

    const checkemailquery = 'SELECT * FROM Users WHERE User_Email = ?';
    const checkemailresults = await db.getquery(checkemailquery, [email]);
    
    if (checkemailresults.length > 0) {
        return { success: false, message: "Email already used. Try another email." };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    const AddUserQuery = 'INSERT INTO Users (User_ID, User_Name, User_Email, User_Password) VALUES (?, ?, ?, ?)';
    await db.getquery(AddUserQuery, [userId, username, email, hashedpassword]);

    const token = jwt.sign({ User_ID: userId }, JWT_Secret_key);
    
    return { message: "User Created Successfully", token };
}

module.exports = { userSignup };
