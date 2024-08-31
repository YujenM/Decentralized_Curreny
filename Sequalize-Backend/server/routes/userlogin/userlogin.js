const express=require('express');
const router=express.Router();
const {User}=require('../../models')

router.get('/checkingroute',async(req,res)=>{
    res.send('checking route')
})


