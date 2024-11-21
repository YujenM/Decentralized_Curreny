const axios = require('axios');
const nodemailer = require('nodemailer');
const db = require('../../Database/ConnectDb');

const randomnum = () => Math.floor(100000 + Math.random() * 900000);

const fetchCryptoData = async (uuid, timePeriod) => {
    try {
        const apiUrl = `https://api.coinranking.com/v2/coin/${uuid}`;
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { timePeriod },
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        return response.data.data.coin;
    } catch (error) {
        throw new Error(`Request failed for UUID: ${uuid}, TimePeriod: ${timePeriod}: ${error.message}`);
    }
};

const deleteOldCryptoData = async (uuid, timeInterval) => {
    const deleteQuery = `DELETE FROM Crypto_price WHERE UUID = ? AND timeInterval = ?`;
    const values = [uuid, timeInterval];
    try {
        await db.getquery(deleteQuery, values);
    } catch (error) {
        throw error;
    }
};

const insertCryptoPriceData = async (coinData) => {
    const uuid = coinData.uuid;
    const Cryptoprice_ID = `MARK-CRYPTO-${randomnum()}`;
    const price = coinData.price;
    const numberOfMarkets = coinData.numberOfMarkets;
    const numberOfExchanges = coinData.numberOfExchanges;
    const volume24h = coinData["24hVolume"];
    const marketCap = coinData.marketCap;
    const fullyDilutedMarketCap = coinData.fullyDilutedMarketCap;
    const change = coinData.change;
    const sparkline = JSON.stringify(coinData.sparkline);
    const timeInterval = coinData.timeInterval;

    const insertQuery = `
        INSERT INTO Crypto_price (UUID, Cryptoprice_ID, Currency, timeInterval, numberofmarkets, numberofexchanges, 24HVolume, marketcap, Dmarketcap, Price, CryptoChange, Sparklingline)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        uuid, Cryptoprice_ID, 'USD', timeInterval, numberOfMarkets, 
        numberOfExchanges, volume24h, marketCap, fullyDilutedMarketCap, 
        price, change, sparkline
    ];

    try {
        await deleteOldCryptoData(uuid, timeInterval);
        const result = await db.getquery(insertQuery, values);
        return result;
    } catch (error) {
        throw error;
    }
};

const sendCompletionEmail = async () => {
    const email = process.env.AdminEmail;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Crypto Data Load Completed',
        text: `Hello,\n\nAll cryptocurrency data has been successfully loaded into the database.\n\nRegards,\nCrypto Tracker`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

const fetchAllCryptoData = async (listOfUUID, timeIntervals) => {
    try {
        for (let uuid of listOfUUID) {
            for (let interval of timeIntervals) {
                const coinData = await fetchCryptoData(uuid, interval);
                coinData.timeInterval = interval;
                await insertCryptoPriceData(coinData);
            }
        }
        await sendCompletionEmail();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchCryptoData,
    insertCryptoPriceData,
    fetchAllCryptoData
};
