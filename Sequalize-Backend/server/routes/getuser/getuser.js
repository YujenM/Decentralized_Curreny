const express=require('express')
const router=express.Router();
const userRoute =require('../../controllers/getuser');



router.route('/').get(userRoute.getuser);


module.exports=router;
