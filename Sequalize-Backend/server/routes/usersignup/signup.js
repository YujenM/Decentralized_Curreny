const express=require('express');
const router=express.Router();
const signupcontroller=require('../../controllers/Usersignup');


router.get('/checkingsignuproute',(req,res)=>{
    res.send('checking signup route')
});


router.route('/usersignup').post(signupcontroller.signup);


module.exports=router;