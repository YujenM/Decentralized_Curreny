const db = require('../../Database/ConnectDb');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const JWT_SECRET = process.env.SECRET_KEY;

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
                        reject(new Error(error.message));
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(file.buffer);
        });

        const userId = req.user.User_ID;
        console.log("Userid:"+userId);
        const profileQuery = "UPDATE Users SET User_Photo = ? WHERE User_ID = ?";
        db.getquery(profileQuery, [result.secure_url, userId], (err) => {
            if (err) {
                res.status(500).send('Server Error');
            } else {
                res.status(200).json({ message: 'Profile photo updated successfully' });
            }
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = { addprofile, uploadImage };
