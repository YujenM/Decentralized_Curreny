const db=require('../../Database/ConnectDb');

const getanalysiscryptodata=async(req,res)=>{
    const id =req.params.id;
    try{
        const analysisdataquery='SELECT cc.Crypto_Name , cc.Crypto_Symbol , cc.Crypto_image, cc.Crypto_Discription, cc.Crypto_Websiteurl,cc.Crypto_Rank FROM Crypto_Currencies cc WHERE cc.UUID=?  '
        const analysisresult= await db.getquery(analysisdataquery,[id]);
        console.log(analysisresult);
        res.send(analysisresult);
    }catch(err){
        throw new Error(`Error fetching analysis data:${err.message}`);
    }
}

module.exports={
    getanalysiscryptodata
}