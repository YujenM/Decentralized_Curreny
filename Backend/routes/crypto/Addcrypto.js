const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('../../Database/ConnectDb');
const path = require('path'); 

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

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/testingrouter', (req, res) => {
    res.send("Testing router");
});

router.post('/upload', uploadImage, async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload file to Cloudinary
        const stream = cloudinary.uploader.upload_stream(
            { folder: "CryptoLogo" },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                // Insert into the database
                try {
                    await db.getquery(
                        'INSERT INTO Cryptocurrencies (name, symbol, created_at) VALUES (?, ?, ?)',
                        [name, result.secure_url, new Date()]
                    );
                    res.redirect('/');
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            }
        );
        stream.end(file.buffer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

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
