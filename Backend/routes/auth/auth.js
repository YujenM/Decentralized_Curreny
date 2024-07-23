// Creating authentication for users
const express=require('express');
const router=express.Router();
require("dotenv").config();



// importing bcrypt
const bcrypt = require('bcryptjs');
// const jwt=require("jsonwebtoken")
// const JWT_SECRET= process.env.JWT_SECRET;




// testing route
router.get('/test', (req, res) => {
    res.send('Hello World');
});

// signup route

// login route


// update password route
// 

module.exports=router;