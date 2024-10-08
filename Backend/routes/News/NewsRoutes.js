const express= require('express');
const router=express.Router();
const NewsService=require('../../Services/News/Newsserevice');
const latestnewsservice=require('../../Services/News/getlatestnews');
const newsbyid=require('../../Services/News/getnewsbyid');



router.get('/',(req,res)=>{
    res.send("News Route")
})

router.post('/addnews',NewsService.addNews);

router.get('/getlatestnews/:limit',latestnewsservice.getLatestNews);
router.get('/getnewsbyid/:id',newsbyid.getnewsbyid);

module.exports=router;