const express = require('express');
const router = express.Router();
const cryptocoinservice = require('../../Services/coinapiprice/coinapiprice');
const analysisdataservice = require('../../Services/Crypto/analysiscryptodata');
const tabledataservices = require('../../Services/Crypto/tabledata');
const allcurrencychart = require('../../Services/Crypto/allcurrencychart');
const trendingmodule = require('../../Services/Crypto/trendingmodule.js');

router.get('/', (req, res) => {
    res.send("Hello from getcoincryptoprice");
});

router.post('/addcryptos', async (req, res, next) => {
    try {
        const listOfUUID = ["Qwsogvtv82FCd", "razxDUgYGNAdQ", "25W7FG7om", "D7B1x_ks7WhV5", "dvUj0CzDZ"];
        
        await cryptocoinservice.fetchAllCryptoData(listOfUUID);

        // Send success response
        res.status(200).send({ status: 'success', message: 'Crypto data inserted successfully for all UUIDs' });
    } catch (error) {
        res.status(500).send({ error: { message: error.message } });
        next(error);
    }
});

router.get('/getanalysiscryptodata/:id', analysisdataservice.getanalysiscryptodata);
router.get('/alltabledata', tabledataservices.fetchtabledata);
router.get('/allcurrencychartdata', allcurrencychart.fetchallcurrencychart);
router.get('/trendingdata/:cryptoname/:cryptotime', trendingmodule.fetchtrendingdata);

module.exports = router;
