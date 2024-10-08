const db=require('../../Database/ConnectDb');

const fectchanalysisdata=async(req,res)=>{
    try{
        const analysisdataquerry='SELECT cc.UUID, cc.Crypto_Symbol, cc.Crypto_image FROM Crypto_Currencies cc';
        const analysisresult= await db.getquery(analysisdataquerry);
        // console.log(analysisresult);
        return res.send(analysisresult);
        console.log('Data fetched successfully');

    }catch(err){
        throw new Error(`Error fetching analysis data:${err.message}`);
    }

}

module.exports={
    fectchanalysisdata
}