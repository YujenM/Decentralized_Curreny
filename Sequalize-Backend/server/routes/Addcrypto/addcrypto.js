const express=require('express');
const router=express.Router();

const addcryptocinroller=require('../../controllers/Addcryptocontrollers');


router.post('/addcrypto',addcryptocinroller.addcrypto);

// router.get('/getcrypto',addcryptocinroller.getcrypto);