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
], (req, res) => {
    let success = false; // Corrected variable declaration
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        });
    }
    try {
        const { username, email, password } = req.body;
        const checkemailquery = 'SELECT * FROM Users WHERE email = ?';
        db.getquery(checkemailquery, [email], (err, results) => {
            if (err) {
                console.error("Check email query error: ", err); 
                return res.status(500).json({
                    error: "Database Query error"
                });
            }
            if (results.length > 0) {
                return res.status(400).json({
                    error: "Email Already exists in Database"
                });
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hashedpassword = bcrypt.hashSync(password, salt);
                const AddUserQuery = 'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)';
                db.getquery(AddUserQuery, [username, email, hashedpassword], (err, result) => {
                    if (err) {
                        console.error("Add user query error: ", err);
                        return res.status(500).json({
                            error: "Database Query error"
                        });
                    }
                    const token = jwt.sign({ user_id: result.insertId, email }, JWT_Secret_key);
                    success = true;
                    res.json({ success, token }); // Corrected the response
                });
            }
        });
    } catch (err) {
        return res.status(500).json({
            error: "Server error"
        });
    }
});

// login route
// login route
router.post('/userlogin', [
    body('identifier').isLength({ min: 2 }).withMessage('Identifier must be at least 4 characters long'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { identifier, password } = req.body;

    try {
        let loginquery;
        let params;

        if (identifier.includes('@')) {
            loginquery = "SELECT user_id, password_hash FROM Users WHERE email = ?";
            params = [identifier];
        } else {
            loginquery = "SELECT user_id, password_hash FROM Users WHERE username = ?";
            params = [identifier];
        }

        db.getquery(loginquery, params, async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            try {
                const isMatch = await bcrypt.compare(password, results[0].password_hash);
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const token = jwt.sign({ user_id: results[0].user_id }, JWT_Secret_key, { expiresIn: '1h' });
                success = true;
                res.json({ message: 'Login successful', token, success });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// get login user
router.post('/getuser', fetchusers, async (req, res) => {
    try {
        const userid = req.user.user_id;
        const userQuery = 'SELECT user_id, username, email, created_at FROM Users WHERE user_id = ?';
        db.getquery(userQuery, [userid], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(results[0]);
        });
    } catch (err) {
        console.error(err);
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
        const userQuery = 'SELECT password_hash FROM Users WHERE user_id = ?';
        db.getquery(userQuery, [userid], async (err, results) => {
            if (err) {
                console.error("Database query error: ", err);
                return res.status(500).json({ error: "Internal Server Error" }); 
            }
            if (!results || results.length === 0) {
                return res.status(404).json({ error: "User not found" }); // 404 Not Found
            }

            const isMatch = await bcrypt.compare(oldpassword, results[0].password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: 'Old password is incorrect' }); 
            }
            const salt = bcrypt.genSaltSync(10);
            const hashedNewPassword = bcrypt.hashSync(newpassword, salt);

            const updatePasswordQuery = 'UPDATE Users SET password_hash = ? WHERE user_id = ?';
            db.getquery(updatePasswordQuery, [hashedNewPassword, userid], (err, result) => {
                if (err) {
                    console.error("Database update error: ", err);
                    return res.status(500).json({ error: "Internal Server Error" }); 
                }
                success = true;
                res.status(200).json({ success, message: 'Password updated successfully' }); 
            });
        });
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