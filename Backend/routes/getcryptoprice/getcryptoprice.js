const express = require('express');
const router = express.Router();
const db = require('../../Database/ConnectDb');
const axios = require('axios');

router.get('/', (req, res) => {
    res.send("Testing router");
});

const fetchDecentralizedCurrency = async (req, res, next) => {
    try {
        const listofdecentralizedcurrency = ["BTC", "ETH", "DOT", "LTC", "UNI"];
        const frame = "1D";
        const timestampFrom = "2024-08-25T09:30:00Z";
        const timestampTo = "2024-08-28T09:30:00Z";
        const sqlInsert = `INSERT INTO Prices (crypto_id, currency, open, close, high, low, volume, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const sqlCheckDuplicate = `SELECT COUNT(*) AS count FROM Prices WHERE crypto_id = ? AND timestamp = ?`;

        for (const decentralizedCurrency of listofdecentralizedcurrency) {
            const apiUrl = `https://real-time-stock-finance-quote.p.rapidapi.com/quote/crypto/${decentralizedCurrency}-USD?frame=${frame}&limit=10000&from=${timestampFrom}&to=${timestampTo}`;

            const response = await axios.get(apiUrl, {
                headers: {
                    'x-rapidapi-host': 'real-time-stock-finance-quote.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPID_API_KEY
                }
            });

            const priceData = response.data;

            // Fetch crypto_id from the database based on the cryptocurrency symbol
            const cryptoResult = await db.getquery('SELECT crypto_id FROM Cryptocurrencies WHERE symbol = ?', [decentralizedCurrency]);

            if (cryptoResult.length === 0) {
                console.log(`Cryptocurrency ${decentralizedCurrency} not found in the database`);
                continue;
            }

            const cryptoId = cryptoResult[0].crypto_id;

            for (let price of priceData) {
                if (price.open && price.close && price.high && price.low && price.volume && price.time) {
                    const timestamp = new Date(price.time);

                    const checkResult = await db.getquery(sqlCheckDuplicate, [cryptoId, timestamp]);

                    if (checkResult[0].count === 0) {
                        await db.getquery(sqlInsert, [
                            cryptoId,
                            'USD',
                            price.open,
                            price.close,
                            price.high,
                            price.low,
                            price.volume,
                            timestamp
                        ]);
                    } else {
                        console.log(`Duplicate entry found for ${decentralizedCurrency} at timestamp: ${timestamp}`);
                    }
                }
            }
        }

        res.send('Prices successfully fetched and inserted into the database.');
    } catch (err) {
        console.log(err);
        next(err);
    }
};

router.get('/fetch-historical-prices', async (req, res, next) => {
    await fetchDecentralizedCurrency(req, res, next);
});

router.get('/fetchcurrentprice', async (req, res, next) => {
    try {
        const fetchQuery = `
            SELECT c.name, c.symbol, c.image,p.close 
            FROM Cryptocurrencies AS c 
            JOIN Prices AS p 
            ON c.crypto_id = p.crypto_id 
            WHERE c.symbol = 'ETH' 
            AND (p.timestamp = '2024-08-28 10:45:00' OR p.timestamp = CURDATE()) 
            ORDER BY p.timestamp DESC 
            LIMIT 25
        `;
        const result = await db.getquery(fetchQuery);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
