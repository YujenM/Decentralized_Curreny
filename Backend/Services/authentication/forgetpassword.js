// forgotPassword.js
const db = require('../../Database/ConnectDb');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateCode = () => crypto.randomInt(1000, 9999).toString();

// 1. Send reset code to email
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.getquery('SELECT * FROM Users WHERE User_Email=?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ success: false, error: "User not found" });
        }

        const verificationCode = generateCode();
        const salt = await bcrypt.genSalt(10);
        const hashcode =await bcrypt.hash(verificationCode,salt);
        const expirationTime = Date.now() + 15 * 60 * 1000;

        await db.getquery('UPDATE Users SET reset_code=?, reset_code_expiry=? WHERE User_Email=?', [hashcode, expirationTime, email]);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Email sent with verification code" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// 2. Verify reset code
const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await db.getquery('SELECT reset_code, reset_code_expiry FROM Users WHERE User_Email=?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ success: false, error: "User not found" });
        }

        const { reset_code, reset_code_expiry } = user[0];
        const checkcode=await bcrypt.compare(code,reset_code);
        if (!checkcode) {
            return res.status(400).json({ success: false, error: "Invalid or expired code" });
        }
        return res.status(200).json({ success: true, message: "Code verified successfully" });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


// 3. Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetCode } = req.body;
        const user = await db.getquery('SELECT reset_code, reset_code_expiry FROM Users WHERE User_Email=?', [email]);
        console.log("reset code");
        console.log(resetCode);
        console.log("user");
        console.log(user);
        if (!user || user.length === 0) {
            return res.status(400).json({ success: false, error: "User not found" });
        }
        if(user[0].reset_code==null){
            return res.status(400).json({ success: false, error: "No reset code found" });
        }
        const { reset_code, reset_code_expiry } = user[0];
        const checkcode=await bcrypt.compare(resetCode,reset_code);
        if (!checkcode || Date.now() >= reset_code_expiry) {
            return res.status(400).json({ success: false, error: "Invalid or expired code" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        await db.getquery('UPDATE Users SET User_Password=? WHERE User_Email=?', [hashedNewPassword, email]);
        await db.getquery('UPDATE Users SET reset_code=NULL, reset_code_expiry=NULL WHERE User_Email=?', [email]);

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};




module.exports = { requestPasswordReset, verifyResetCode, resetPassword };
