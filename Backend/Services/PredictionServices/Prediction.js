const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // Library for parsing CSV
const db = require('../../Database/ConnectDb.js');

const csvFiles = {
    bitcoin: '../../csv/BTC_predicted_prices.csv',
    ethereum: '../../csv/ETH_future_predicted_prices.csv',
    litecoin: '../../csv/LTC_future_predicted_prices.csv',
    avax: '../../csv/AVAX_future_predicted_prices.csv',
    polkadot: '../../csv/DOT_future_predicted_prices.csv',
};

const uuids = {
    bitcoin: 'Qwsogvtv82FCd',
    ethereum: 'razxDUgYGNAdQ',
    litecoin: 'D7B1x_ks7WhV5',
    avax: 'dvUj0CzDZ',
    polkadot: '25W7FG7om',
};

const InsertPrediction = async (req, res) => {
    try {
        for (const [crypto, csvPath] of Object.entries(csvFiles)) {
            const uuid = uuids[crypto];
            const filePath = path.resolve(__dirname, csvPath);
            const predictedPrices = []; // Array to store predicted prices

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const predictedPrice = row['Predicted Price'] || row['PredictedPrice'];
                    predictedPrices.push(predictedPrice); // Add predicted price to array
                })
                .on('end', async () => {
                    try {
                        const predictionId = `${uuid}-${crypto}`;

                        // Delete existing data for this Prediction_ID
                        const deleteQuery = `
                            DELETE FROM Prediction
                            WHERE Prediction_ID = ?
                        `;
                        await db.getquery(deleteQuery, [predictionId]);

                        // Insert new data
                        const insertQuery = `
                            INSERT INTO Prediction (Prediction_ID, UUID, PredictionPrice)
                            VALUES (?, ?, ?)
                        `;
                        await db.getquery(insertQuery, [
                            predictionId,
                            uuid,
                            JSON.stringify(predictedPrices), 
                        ]);

                        console.log(`${crypto} data inserted successfully!`);
                    } catch (err) {
                        console.error(`Error processing ${crypto}:`, err);
                    }
                });
        }

        res.status(200).send({ message: 'Data insertion started. Check logs for details.' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send({ error: 'Failed to insert prediction data.' });
    }
};


const getcryptoprediction = async (req, res) => {
    try {
        const results = {};
        
        for (const [crypto, uuid] of Object.entries(uuids)) {
            const query = `
                SELECT 
                    p.Prediction_ID,
                    p.UUID,
                    p.PredictionPrice,
                    p.created_at,
                    cp.Price
                FROM 
                    Prediction p
                JOIN 
                    (SELECT DISTINCT UUID, Price FROM Crypto_price WHERE timeInterval = '24h') cp
                ON 
                    p.UUID = cp.UUID
                WHERE 
                    p.UUID = ?
                ORDER BY 
                    p.created_at ASC;
            `;
            const data = await db.getquery(query, [uuid]);
            const parsedData = data.map(item => ({
                ...item,
                PredictionPrice: JSON.parse(item.PredictionPrice),
            }));

            results[crypto] = parsedData;
        }

        res.status(200).json({
            success: true,
            message: 'Crypto predictions fetched successfully.',
            data: results,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching predictions' });
    }
}

module.exports = { InsertPrediction,getcryptoprediction };
