const express = require('express');
const db = require('../../Database/ConnectDb');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const jwt = require("jsonwebtoken");
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.Cloud_key,
    api_secret: process.env.Cloud_secret
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

const authenticateUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

const addprofile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "Profile" },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            );
            stream.end(file.buffer);
        });

        const userId = req.user?.User_ID;
        if (!userId) {
            return res.status(401).json({ error: 'User not authorized' });
        }

        const profileQuery = "UPDATE Users SET User_Photo = ? WHERE User_ID = ?";
        const queryResult = await db.getquery(profileQuery, [result.secure_url, userId]);

        if (!queryResult.affectedRows) {
            return res.status(500).json({ error: 'Server Error: Unable to update profile' });
        }

        res.status(200).json({ message: 'Profile photo updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = { addprofile, uploadImage, authenticateUser };
