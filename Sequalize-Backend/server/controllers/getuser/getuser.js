const httpstatus = require('http-status');
const getuserservices = require('../../services/Getuserdata');

module.exports = async(req,res,next)=>{
    try{
        const userId=req.decoded.id;
        const user = await getuserservices.getuser(userId);
        res.status(httpstatus.OK).json({
            message: "success",
            data: user
        });
    }catch(err){
        next(err);
    }
}