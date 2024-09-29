const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('../../Database/ConnectDb');
const path = require('path');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.Cloud_key,
    api_secret: process.env.Cloud_secret
});

// Setup Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for image upload
const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// Route to serve homepage
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Testing route
router.get('/testingrouter', (req, res) => {
    res.send("Testing router");
});

// Route to handle cryptocurrency upload with image
router.post('/upload', uploadImage, async (req, res) => {
    try {
        const { name, symbol } = req.body; // Retrieve name and symbol from request body
        const file = req.file; // Retrieve the uploaded file

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload the image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "CryptoLogo" },
                (error, result) => {
                    if (error) {
                        reject(new Error(error.message));
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(file.buffer); // Send file buffer to the upload stream
        });

        // Insert cryptocurrency data into the database
        await db.getquery(
            'INSERT INTO Cryptocurrencies (name, symbol, image, created_at) VALUES (?, ?, ?, ?)',
            [name, symbol, result.secure_url, new Date()] // Use Cloudinary URL for image
        );

        res.redirect('/');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Route to retrieve all cryptocurrencies
router.get('/getCryptos', async (req, res) => {
    try {
        const query = 'SELECT * FROM Cryptocurrencies';
        const results = await db.getquery(query);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
