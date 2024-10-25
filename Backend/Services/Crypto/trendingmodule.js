const db=require('../../Database/ConnectDb');

const fetchtrendingdata = async (req, res) => {
    try {
        const cryptoname = req.params.cryptoname;  
        const trendingdate = req.params.cryptotime; 
        const trendingquery = `
            SELECT
                cc.UUID,
                cc.Crypto_Name,
                cc.Crypto_Symbol,
                cp.Price,
                cp.Currency,
                cp.Sparklingline,
                cp.timeInterval
            FROM 
                Crypto_Currencies cc
            JOIN 
                Crypto_price cp ON cc.UUID = cp.UUID
            WHERE 
                cc.Crypto_Name = ? 
                AND cp.timeInterval IN (?);
        `;
        const trendingdata = await db.getquery(trendingquery, [cryptoname, trendingdate]);
        if(trendingdata.length ===0){
            return res.status(404).send({status:"error",message:"No data found"});
        }
        const cleandata=trendingdata.map(item=>{
            let sparklingline;
            try{
                sparklingline=JSON.parse(item.Sparklingline.replace(/\\/g,''));
            }catch(error){
                sparklingline=[];
            }
            return{
                ...item,
                Sparklingline:sparklingline,
            };
        });
        return res.status(200).send({ status: 'success', data: cleandata });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 'error', message: error.message });
    }
}

module.exports={
    fetchtrendingdata
}