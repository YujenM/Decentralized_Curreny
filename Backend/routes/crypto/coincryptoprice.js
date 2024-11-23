const express = require('express');
const router = express.Router();
const cryptocoinservice = require('../../Services/coinapiprice/coinapiprice');
const analysisdataservice = require('../../Services/Crypto/analysiscryptodata');
const tabledataservices = require('../../Services/Crypto/tabledata');
const allcurrencychart = require('../../Services/Crypto/allcurrencychart');
const trendingmodule = require('../../Services/Crypto/trendingmodule');
const nodemailer = require('nodemailer');

router.get('/',(req,res)=>{
    res.send("Hello from getcoincryptoprice");
})
router.post('/addcryptos', async (req, res, next) => {
    try {
        const listOfUUID = ["Qwsogvtv82FCd", "razxDUgYGNAdQ", "25W7FG7om", "D7B1x_ks7WhV5", "dvUj0CzDZ"];
        const timePeriods = req.body.timePeriods || ["24h", "7d", "30d"];

        await cryptocoinservice.fetchAllCryptoData(listOfUUID, timePeriods);

        // Sending email notification after data loading
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ['maharjanyuzen@gmail.com', 'aadarshashrestha1@gmail.com'],
            subject: 'Crypto Data Load Complete',
            text: 'The cryptocurrency data has been successfully loaded into the database.'
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully.');

        res.status(200).send({
            status: 'success',
            message: 'Crypto data inserted for all UUIDs and time periods, and email notification sent.'
        });
    } catch (error) {
        res.status(500).send({ error: { message: error.message } });
        next(error);
    }
});

router.get('/getanalysiscryptodata/:id',analysisdataservice.getanalysiscryptodata);
router.get('/alltabledata',tabledataservices.fetchtabledata);
router.get('/allcurrencychartdata',allcurrencychart.fetchallcurrencychart);
router.get('/trendingdata/:cryptoname/:cryptotime',trendingmodule.fetchtrendingdata)

module.exports=router;