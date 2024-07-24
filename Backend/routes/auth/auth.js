const express = require('express');
const router = express.Router();
require("dotenv").config();

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
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            error: error.array()
        });
    }
    try{
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
                    return res.status(200).json({
                        message: "User added successfully",
                        token: token
                    });
                });
            }
        });
    }catch(err){
        return res.status(500).json({
            error:"Server error"
        })
    }
    
});

// login route
router.post('/userlogin', [
    body('username').isLength({ min: 4 }),
    body('email').optional().isEmail(),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { username, email, password } = req.body;

    try {
        let loginquery;
        let params;

        if (email) {
            loginquery = "SELECT user_id, password_hash FROM Users WHERE username = ? AND email = ?";
            params = [username, email];
        } else {
            loginquery = "SELECT user_id, password_hash FROM Users WHERE username = ?";
            params = [username];
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

                const token = jwt.sign({ user_id: results[0].user_id }, 'your_jwt_secret', { expiresIn: '1h' });
                success=true;
                res.json({ message: 'Login successful', token,success });
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
module.exports = router;
