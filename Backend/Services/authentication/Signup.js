const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../Database/ConnectDb');
require('dotenv').config();

const JWT_Secret_key = process.env.SECRET_KEY;

const validateSignup = [
    body('username').isLength({ min: 4 }),
    body('email').isEmail(),
    body('password')
        .isLength({ min: 8 })
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        next();
    }
];

const generaterandomnumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const userSignup = async (username, email, password) => {
    let userId = '';
    let isUnique = false;

    while (!isUnique) {
        let randomNumber = generaterandomnumber();
        userId = `MARK-${randomNumber}`;
        const checkUserIdQuery = 'SELECT * FROM Users WHERE User_ID = ?';
        const checkUserIdResults = await db.getquery(checkUserIdQuery, [userId]);
        if (checkUserIdResults.length === 0) {
            isUnique = true;
        }
    }

    const checkEmailQuery = 'SELECT * FROM Users WHERE User_Email = ?';
    const checkEmailResults = await db.getquery(checkEmailQuery, [email]);
    
    if (checkEmailResults.length > 0) {
        return { success: false, message: "Email already used. Try another email." };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const addUserQuery = 'INSERT INTO Users (User_ID, User_Name, User_Email, User_Password) VALUES (?, ?, ?, ?)';
    await db.getquery(addUserQuery, [userId, username, email, hashedPassword]);

    const token = jwt.sign({ User_ID: userId }, JWT_Secret_key);
    
    return { success: true, message: "User Created Successfully", token };
};

module.exports = { validateSignup, userSignup };
