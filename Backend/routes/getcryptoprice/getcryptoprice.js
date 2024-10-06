const express = require('express');
const router = express.Router();
const db = require('../../Database/ConnectDb');
const axios = require('axios');

const fetchDecentralizedCurrency = async (req, res, next) => {
    try {
        const listofdecentralizedcurrency = ["BTC", "ETH", "DOT", "SOL", "AVAX"];
        const frame = "1D";
        const now = new Date();
        const timestampFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const timestampTo = now.toISOString();

        console.log(timestampFrom, timestampTo);

        const sqlInsert = `INSERT INTO Prices (crypto_id, currency, open, close, high, low, volume, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const sqlCheckDuplicate = `SELECT COUNT(*) AS count FROM Prices WHERE crypto_id = ? AND timestamp = ?`;
        const sqlDeletePreviousData = `DELETE FROM Prices WHERE crypto_id = ? AND DATE(timestamp) < CURDATE()`;

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
                            insertedData++; 
                        } else {
                            console.log(`Duplicate entry found for ${decentralizedCurrency} at timestamp: ${timestamp}`);
                        }
                    }
                }

                if (insertedData > 0) {
                    console.log(`Inserted ${insertedData} new data entries for ${decentralizedCurrency}, deleting previous data`);
                    await db.getquery(sqlDeletePreviousData, [cryptoId]);
                } else {
                    console.log(`No new data inserted for ${decentralizedCurrency}`);
                }

            } catch (axiosError) {
                if (axiosError.response && axiosError.response.status === 400) {
                    console.log(`No data available for ${decentralizedCurrency} today. API returned 400 status.`);
                } else {
                    console.error(`Error fetching data for ${decentralizedCurrency}: ${axiosError.message}`);
                }
            }
        }

        res.send('Prices successfully fetched and processed for today.');

    } catch (err) {
        console.error(`Error in fetchDecentralizedCurrency: ${err.message}`);
        res.status(500).send({ error: { message: 'An internal error occurred.' } });
        next(err);
    }
};



router.get('/fetch-historical-prices', async (req, res, next) => {
    await fetchDecentralizedCurrency(req, res, next);
});

router.get('/fetchcurrentprice', async (req, res, next) => {
    try {
        const fetchQuery = `
            SELECT c.name, c.symbol, c.image,p.close,p.timestamp,p.currency
            FROM Cryptocurrencies c
            JOIN Prices p
            ON c.crypto_id = p.crypto_id;
        `;
        const result = await db.getquery(fetchQuery);
        
        if (result.length === 0) {
            return res.status(404).send({ message: 'No prices found in the database.' });
        }

        res.send(result);
    } catch (err) {
        console.log(`Error occurred: ${err.message}`);
        res.status(500).send({ error: 'An error occurred while fetching current prices. Please try again later.' });
        next(err); 
    }
});

router.get('/calculate-percentage-change/:symbol', async (req, res, next) => {
    try {
        const symbol = req.params.symbol;

        const fetchQuery = `
            SELECT p.open, p.close
            FROM Prices p
            JOIN Cryptocurrencies c ON p.crypto_id = c.crypto_id
            WHERE c.symbol = ?
            ORDER BY p.timestamp DESC
            LIMIT 1;  
        `;

        const result = await db.getquery(fetchQuery, [symbol]);

        if (result.length === 0) {
            return res.status(404).send({ message: 'No price data found for this cryptocurrency.' });
        }

        const { open, close } = result[0];
        const percentageChange = ((close - open) / open) * 100;

        res.send({
            symbol,
            open,
            close,
            percentageChange: percentageChange.toFixed(2), 
        });
    } catch (err) {
        console.log(`Error occurred: ${err.message}`);
        res.status(500).send({ error: 'An error occurred while calculating percentage change.' });
        next(err);
    }
});

router.get('/price-summary/:symbol', async (req, res, next) => {
    try {
        const symbol = req.params.symbol;

        const fetchQuery = `
            SELECT 
                MAX(p.high) AS highestPrice,
                MIN(p.low) AS lowestPrice,
                AVG(p.close) AS averagePrice,
                COUNT(*) AS totalRecords
            FROM Prices p
            JOIN Cryptocurrencies c ON p.crypto_id = c.crypto_id
            WHERE c.symbol = ?;
        `;

        const result = await db.getquery(fetchQuery, [symbol]);

        if (result.length === 0) {
            return res.status(404).send({ message: 'No price data found for this cryptocurrency.' });
        }

        res.send({
            symbol,
            highestPrice: result[0].highestPrice,
            lowestPrice: result[0].lowestPrice,
            averagePrice: result[0].averagePrice,
            totalRecords: result[0].totalRecords,
        });
    } catch (err) {
        console.log(`Error occurred: ${err.message}`);
        res.status(500).send({ error: 'An error occurred while fetching price summary.' });
        next(err);
    }
});

module.exports = router;
