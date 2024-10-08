const db=require('../../Database/ConnectDb');

const fetchtabledata=async(req,res)=>{
    try{
        const tablequery="SELECT cc.Crypto_Name, cc.Crypto_image,cc.Crypto_Rank ,cp.Price, cp.numberofexchanges, cp.marketcap, cp.Currency FROM Crypto_Currencies cc INNER JOIN Crypto_price cp ON cc.UUID=cp.UUID WHERE cp.timeInterval='24h' ORDER BY CAST(cc.Crypto_Rank AS UNSIGNED)";
        const tabledata=await db.getquery(tablequery);
        return res.status(200).send({status:'success',data:tabledata});

    }catch(error){
        throw new Error(error);
    }
}

module.exports={
    fetchtabledata
}