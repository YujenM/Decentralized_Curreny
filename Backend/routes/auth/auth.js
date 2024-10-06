const express = require('express');
const router = express.Router();
require("dotenv").config();
const passport = require('passport');
require('./googleauth');
// importing middleware
const fetchusers=require('../../middleware/authmiddleware');
const session = require('express-session');

// importing database
const db = require('../../Database/ConnectDb');
const { body, validationResult } = require('express-validator');

// importing bcrypt
const bcrypt = require('bcryptjs');

// importing jwt
const jwt = require('jsonwebtoken');
const JWT_Secret_key = process.env.SECRET_KEY;

const {userlogin}=require('../../Services/authentication/Login');
const {userSignup}=require('../../Services/authentication/Signup');

// testing route
router.get('/test', (req, res) => {
    res.send('Hello World');
});

// signup route

router.post('/usersignup', [
    body('username').isLength({ min: 4 }),
    body('email').isEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
], async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        });
    }
    try {
        const { username, email, password } = req.body;
        const result = await userSignup(username, email, password);
        res.json(result);
    } catch (err) {
        console.error("Server error: ", err);
        return res.status(500).json({
            error: "Server error"
        });
    }
});


// login route
router.post('/userlogin', [
    body('identifier').isLength({ min: 2 }),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { identifier, password } = req.body;

    try {
        const { token, user_id } = await userlogin(identifier, password);
        res.json({ message: 'Login successful', token, user_id, success: true });
    } catch (error) {
        console.error("Server error: ", error.message);
        res.status(401).json({ error: error.message });
    }
});

// get login user
router.get('/getuser', fetchusers, async (req, res) => {
    try {
        const userId = req.user.User_ID;
        const getUserQuery = 'SELECT User_ID, User_Name, User_Email, created_at FROM Users WHERE User_ID = ?';
        const userData = await db.getquery(getUserQuery, [userId]);

        if (userData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: userData[0]
        });
    } catch (err) {
        console.error("Server error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



//update and Forget  password
router.post('/updatepassword', fetchusers, [
    body('oldpassword').isLength({ min: 8 }).withMessage('Old password must be at least 8 characters long'),
    body('newpassword')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('New password must contain at least one special character')
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }
    const { oldpassword, newpassword } = req.body;
    try {
        const userid = req.user.user_id;
        const userQuery = 'SELECT User_Password FROM Users WHERE User_ID = ?';
        const results = await db.getquery(userQuery, [userid]);

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldpassword, results[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Old password is incorrect' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedNewPassword = bcrypt.hashSync(newpassword, salt);

        const updatePasswordQuery = 'UPDATE Users SET password_hash = ? WHERE user_id = ?';
        await db.getquery(updatePasswordQuery, [hashedNewPassword, userid]);

        success = true;
        res.status(200).json({ success, message: 'Password updated successfully' });
        
    } catch (err) {
        console.error("Server error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.use(passport.initialize());
router.use(passport.session());

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect(`http://localhost:3000/auth/google/success?token=${req.user.token}`);
    }
);
module.exports = router;