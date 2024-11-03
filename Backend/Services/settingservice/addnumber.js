const db=require('../../Database/ConnectDb');

const addnumber=async(req,res)=>{
    try{
        const userId=req.user.User_ID;
        const {phone}=req.body;
        const checkQuery="SELECT User_Number FROM Users WHERE User_ID=?";
        const addQuery="UPDATE Users SET User_Number=? WHERE User_ID=?";
        const checkResult=await db.getquery(checkQuery,[userId]);
        if(checkResult[0].Phone===phone){
            return res.status(400).send('Phone number already exists');
        }
        const addResult=await db.getquery(addQuery,[phone,userId]);
        if(addResult.affectedRows===0){
            return res.status(400).send('Phone number not added');
        }
        return res.status(200).send('Phone number added');
    }catch(err){
        console.error("Error adding phone number:",err);
        res.status(500).send('Server Error');
    }
}
module.exports=addnumber;