const db=require('../../Database/ConnectDb');

const getnewsbyid=async(req,res)=>{
    let id =req.params.id;
    try{
        const newsquery='SELECT NewsTitle , NewDescription, Tumbnail, NewsUrl,Created_at FROM NEWS WHERE NewsId=?'; ;
        const newsqueryresult=await db.getquery(newsquery,[id]);
        if(newsqueryresult.length===0){
            return res.status(404).send('No news found');
        }
        return res.status(200).send(newsqueryresult);

    }catch(err){
        throw new Error(`Error in getnewsbyid ${err}`);
    }
}

module.exports={
    getnewsbyid
}