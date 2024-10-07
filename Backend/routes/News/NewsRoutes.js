const express= require('express');
const router=express.Router();
const NewsService=require('../../Services/News/Newsserevice');


router.get('/',(req,res)=>{
    res.send("News Route")
})

router.post('/addnews',NewsService.addNews);

module.exports=router;