const express = require('express');
const router=express.Router();
const cryptocoinservice=require('../../Services/coinapiprice/coinapiprice')
const analysisdataservice=require('../../Services/Crypto/analysiscryptodata')
const tabledataservices=require('../../Services/Crypto/tabledata');
const allcurrencychart=require('../../Services/Crypto/allcurrencychart');

router.get('/',(req,res)=>{
    res.send("Hello from getcoincryptoprice");
})
router.post('/addcryptos', async (req, res, next) => {
    try {
        const listOfUUID = ["Qwsogvtv82FCd", "razxDUgYGNAdQ", "25W7FG7om", "D7B1x_ks7WhV5", "dvUj0CzDZ"];
        const timePeriods = req.body.timePeriods || ["24h", "7d", "30d"];
        
        await cryptocoinservice.fetchAllCryptoData(listOfUUID, timePeriods);
        res.status(200).send({ status: 'success', message: 'Crypto data inserted for all UUIDs and time periods' });
    } catch (error) {
        res.status(500).send({ error: { message: error.message } });
        next(error);
    }
});

router.get('/getanalysiscryptodata/:id',analysisdataservice.getanalysiscryptodata);
router.get('/alltabledata',tabledataservices.fetchtabledata);
router.get('/allcurrencychartdata',allcurrencychart.fetchallcurrencychart);
module.exports=router;