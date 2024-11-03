const express = require('express');
const router = express.Router();
const path = require('path');
const { addprofile, uploadImage } = require('../../Services/settingservice/addprofile');
const authMiddleware = require('../../middleware/authmiddleware');
const removeprofile=require('../../Services/settingservice/deleteprofile');
const addnumber=require('../../Services/settingservice/addnumber');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
router.put('/addprofile', authMiddleware, uploadImage, addprofile);
router.delete('/removeprofile',authMiddleware,removeprofile);
router.post('/addnumber',authMiddleware,addnumber);

module.exports = router;
