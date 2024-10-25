const express = require('express');
const router = express.Router();
const protfolioservice = require('../../Services/Portfolio/Portfolio');
const authMiddleware = require('../../middleware/authmiddleware');

router.get('/', (req, res) => {
    res.send("Hello from Portfolio");
});

router.post('/addcryptoportfolio', authMiddleware, protfolioservice.addcryptoportfolio);
router.get('/getcrypto', authMiddleware, protfolioservice.getcrypto);
router.delete('/deletecrypto', authMiddleware, protfolioservice.deletecrypto);

module.exports = router;
