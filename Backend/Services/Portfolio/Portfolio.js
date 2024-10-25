const db = require('../../Database/ConnectDb');

const addcryptoportfolio = async (req, res) => {
    try {
        const user_id = req.user.User_ID;
        const { cryptoUUID } = req.body; 
        // console.log("User ID:", user_id);
        // console.log("Crypto UUID:", cryptoUUID);
        if (!user_id || !cryptoUUID) {
            return res.status(400).json({ error: "User ID or Crypto UUID is missing" });
        }
        const checkUUIDquery = `SELECT UUID FROM Portfolio WHERE UUID = ?`;
        const checkUUIDParams = [cryptoUUID];
        const checkUUIDResult = await db.getquery(checkUUIDquery, checkUUIDParams);
        if(checkUUIDResult.length>0){
            return res.status(400).json({
                message:"Crypto Already added to Portfolio"
            })
        }

        if (checkUUIDResult.length > 0) {
            return res.status(400).json({ error: "Crypto UUID already exists in portfolio" });
        }

        
        const portfolioIdnum = Math.floor(1000 + Math.random() * 9000);
        const portfolioId=`MARK-P${portfolioIdnum}`

        // Insert the new entry into the Portfolio table
        const query = `
            INSERT INTO Portfolio (Portfolio_ID, User_ID, UUID, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        
        // Use getquery to handle the query with promise-based syntax
        const params = [portfolioId, user_id, cryptoUUID];
        const result = await db.getquery(query, params);

        res.status(201).json({ message: "Crypto added to portfolio successfully", data: result });
        
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getcrypto=async(req,res)=>{
    try{
        const userid=req.user.User_ID;
        // const {cryptoUUID}=req.body;
        const getportfolioquerry="SELECT pc.UUID, cc.Crypto_Name, cc.Crypto_Symbol, cp.numberofexchanges, cp.24HVolume, cp.Price FROM Portfolio pc JOIN Crypto_Currencies cc ON pc.UUID = cc.UUID JOIN Crypto_price cp ON pc.UUID = cp.UUID WHERE pc.User_ID =? AND cp.timeInterval ='24h';";
        const getportfolioresult=await db.getquery(getportfolioquerry,[userid]);
        if(getportfolioresult.length===0){
            return res.status(404).json({error:"No data found"});
        }
        res.status(200).json({
            success:true,
            data:getportfolioresult
        })

    }catch(err){
        console.log("server error:",err.message);
        res.send(500).json({error:"Internal Server Error"});
    }
}

const deletecrypto=async(req,res)=>{
    try{
        const userid=req.user.User_ID;
        const {cryptoUUID}=req.body;
        const checkUUIDquery = `SELECT UUID FROM Portfolio WHERE UUID = ?`;
        const checkUUIDParams = [cryptoUUID];
        const checkUUIDResult = await db.getquery(checkUUIDquery, checkUUIDParams);
        if(checkUUIDResult.length===0){
            return res.status(400).json({error:"Crypto UUID does not exist in portfolio"});
        }

        const deleteportfolioquerry="DELETE FROM Portfolio WHERE User_ID = ? AND UUID = ?";
        const deleteportfolioresult=await db.getquery(deleteportfolioquerry,[userid,cryptoUUID]);
        if(deleteportfolioresult.affectedRows===0){
            return res.status(404).json({error:"No data found"});
        }
        res.status(200).json({
            success:true,
            data:deleteportfolioresult
        })

    }catch(err){
        console.log("server error:",err.message);
        res.send(500).json({error:"Internal Server Error"});
    }
}

module.exports = {
    addcryptoportfolio,
    getcrypto,
    deletecrypto
};
