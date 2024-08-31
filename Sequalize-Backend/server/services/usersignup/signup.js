
const ValidationError = require("../../errors/validation");
const{User}=require('../../models');
const sequelize =require('sequelize');

module.exports=async(querobj)=>{
    
    // checking if user exists in the database
    const alreadyuserinthedatabase=await User.findOne({
        where:{
            [sequelize.Op.or]:[
                {
                    email:querobj.email || '',
                },
            ]
        }
    });

    if(alreadyuserinthedatabase) {
        throw new ValidationError('User already exists');
      }
    // creating a new user in the database
    else {
        const user = await User.create({
            fullName: querobj.fullName,
            email: querobj.email,
            password: querobj.password,
            phoneNumber: querobj.phoneNumber
        });
    }

    return user;

}
