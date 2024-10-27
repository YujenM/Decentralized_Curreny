const db = require('../../Database/ConnectDb');
const axios = require('axios');

const getBitcoinWeeklyPrice = async (req, res) => {
    const listOfDecentralizedCurrency = ["BTC"];
    const frame = "1W";
    const timestampFrom = "2022-12-01T09:30:00Z";
    const timestampTo = "2024-10-04T00:00:00Z";
    const sqlInsert = `INSERT INTO Bitciondata (Bitcoin_ID, Name, Symbol, PredictionDate, High, Low, OpenData, CloseData, Volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const sqlCheckDuplicate = `SELECT COUNT(*) AS count FROM Bitciondata WHERE Bitcoin_ID = ? AND PredictionDate = ?`;

    try {
        for (const currency of listOfDecentralizedCurrency) {
            const apiUrl = `https://real-time-stock-finance-quote.p.rapidapi.com/quote/crypto/${currency}-USD?frame=${frame}&limit=10000&from=${timestampFrom}&to=${timestampTo}`;
            const response = await axios.get(apiUrl, {
                headers: {
                    'x-rapidapi-host': 'real-time-stock-finance-quote.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPID_API_KEY
                }
            });

            const priceData = response.data;

            if (!priceData || Object.keys(priceData).length === 0) {
                console.log(`No data fetched for ${currency} in the specified date range.`);
                continue;
            }

            console.log(`Data fetched for ${currency}`);
            let insertedData = 0;

            for (let price of priceData) {
                if (price.open && price.close && price.high && price.low && price.volume && price.time) {
                    const timestamp = new Date(price.time);
                    const dateFormatted = timestamp.toISOString().split('T')[0];

                    const checkResult = await db.getquery(sqlCheckDuplicate, [`${currency}-${dateFormatted}`, dateFormatted]);

                    if (checkResult[0].count === 0) {
                        await db.getquery(sqlInsert, [
                            `${currency}-${dateFormatted}`,  
                            'Bitcoin',
                            'BTC',
                            dateFormatted,
                            price.high,
                            price.low,
                            price.open,
                            price.close,
                            price.volume
                        ]);
                        insertedData++;
                    } else {
                        console.log(`Duplicate entry found for ${currency} on date: ${dateFormatted}`);
                    }
                }
            }

            console.log(`Inserted ${insertedData} new records for ${currency}`);
        }
    } catch (axiosError) {
        if (axiosError.response && axiosError.response.status === 400) {
            console.log(`No data available for the specified date range. API returned 400 status.`);
        } else {
            console.error(`Error fetching data: ${axiosError.message}`);
        }
    }
};
module.exports = { getBitcoinWeeklyPrice };
