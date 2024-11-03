const db = require('../../Database/ConnectDb');

const removeprofile = async (req, res) => {
    try {
        const userId = req.user.User_ID;
        const checkQuery = "SELECT User_Photo FROM Users WHERE User_ID = ?";
        const profileQuery = "UPDATE Users SET User_Photo = NULL WHERE User_ID = ?";

        const checkResult = await db.getquery(checkQuery, [userId]);



        const removeResult = await db.getquery(profileQuery, [userId]);
        if(removeResult.affectedRows === 0){
            return res.status(400).send('Profile photo not removed');
        }
        if (checkResult[0].User_Photo === null) {
            return res.status(400).send('Profile photo not found');
        }
        return res.status(200).send('Profile photo removed');


    } catch (err) {
        console.error("Error removing profile photo:", err);
        res.status(500).send('Server Error');
    }
};

module.exports = removeprofile;
