const express = require('express');
const router = express.Router();
const cryptoService = require('../../Services/Crypto/getcrypto');

router.get('/',(req,res)=>{
    res.send("Hello from coincrypto");
})

router.post('/addcryptos', async (req, res, next) => {
    try {
        const listOfUUID = ["Qwsogvtv82FCd", "razxDUgYGNAdQ", "25W7FG7om", "D7B1x_ks7WhV5", "dvUj0CzDZ"];
        const timePeriods = ["24h"];
        
        await cryptoService.fetchAllCryptoData(listOfUUID, timePeriods);
        res.status(200).send({ status: 'success', message: 'Crypto data inserted for all UUIDs and time periods' });
    } catch (error) {
        res.status(500).send({ error: { message: error.message } });
        next(error);
    }
});

module.exports = router;
