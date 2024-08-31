const express=require('express');
const router=express.Router();
const logincontroller=require('../../controllers/Userlogin')

router.get('/checkingroute',async(req,res)=>{
    res.send('checking route')
})


router.route('/login').post(logincontroller.login);



module.exports=router;
