const express = require('express');
const router = express.Router();
const db = require('../../Database/ConnectDb');
const axios = require('axios');

const fetchDecentralizedCurrency = async (req, res, next) => {
    const listofdecentralizedcurrency = ["ETH"];
    const frame = "1W";
    const timestampFrom = "2022-12-01T09:30:00Z";
    const timestampTo = "2024-10-04T00:00:00Z";
    
    // Updated insert statement excluding prediction_id
    const sqlInsert = `INSERT INTO Predictions (crypto_id, currency, open, close, high, low, volume, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const sqlCheckDuplicate = `SELECT COUNT(*) AS count FROM Prices WHERE crypto_id = ? AND timestamp = ?`;
    
    for (const decentralizedCurrency of listofdecentralizedcurrency) {
        const apiUrl = `https://real-time-stock-finance-quote.p.rapidapi.com/quote/crypto/${decentralizedCurrency}-USD?frame=${frame}&limit=10000&from=${timestampFrom}&to=${timestampTo}`;

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'x-rapidapi-host': 'real-time-stock-finance-quote.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPID_API_KEY
                }
            });

            const priceData = response.data;

            if (!priceData || Object.keys(priceData).length === 0) {
                console.log(`No data fetched for ${decentralizedCurrency} today.`);
                continue;
            }

            console.log(`Data fetched for ${decentralizedCurrency}`);

            const cryptoResult = await db.getquery('SELECT crypto_id FROM Cryptocurrencies WHERE symbol = ?', [decentralizedCurrency]);

            if (cryptoResult.length === 0) {
                console.log(`Cryptocurrency ${decentralizedCurrency} not found in the database`);
                continue;
            }

            const cryptoId = cryptoResult[0].crypto_id;
            let insertedData = 0;

            for (let price of priceData) {
                if (price.open && price.close && price.high && price.low && price.volume && price.time) {
                    const timestamp = new Date(price.time);

                    const checkResult = await db.getquery(sqlCheckDuplicate, [cryptoId, timestamp]);

                    if (checkResult[0].count === 0) {
                        // Insert data into Predictions table
                        await db.getquery(sqlInsert, [
                            cryptoId,
                            'USD', // currency
                            price.open,
                            price.close,
                            price.high,
                            price.low,
                            price.volume,
                            timestamp
                        ]);
                        insertedData++;
                    } else {
                        console.log(`Duplicate entry found for ${decentralizedCurrency} at timestamp: ${timestamp}`);
                    }
                }
            }
        } catch (axiosError) {
            if (axiosError.response && axiosError.response.status === 400) {
                console.log(`No data available for ${decentralizedCurrency} today. API returned 400 status.`);
            } else {
                console.error(`Error fetching data for ${decentralizedCurrency}: ${axiosError.message}`);
            }
        }
    }
};

router.get('/fetch-prediction-prices', async (req, res, next) => {
    await fetchDecentralizedCurrency(req, res, next);
    res.send('Data fetch completed.');
});

module.exports = router;
