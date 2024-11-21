const nodemailer = require('nodemailer');
const axios = require('axios');
const db = require('../../Database/ConnectDb');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const randomnum = () => {   
    return Math.floor(100000 + Math.random() * 900000);
};

const fetchCryptoData = async (uuid, timeInterval) => {
    try {
        const apiUrl = `https://api.coinranking.com/v2/coin/${uuid}?timePeriod=${timeInterval}`;
        const options = {
            method: 'GET',
            url: apiUrl,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        return response.data.data.coin;
    } catch (error) {
        throw new Error(`Request failed for UUID: ${uuid}, Interval: ${timeInterval}: ${error.message}`);
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
        ON DUPLICATE KEY UPDATE 
            Currency = VALUES(Currency),
            timeInterval = VALUES(timeInterval),
            numberofmarkets = VALUES(numberofmarkets),
            numberofexchanges = VALUES(numberofexchanges),
            24HVolume = VALUES(24HVolume),
            marketcap = VALUES(marketcap),
            Dmarketcap = VALUES(Dmarketcap),
            Price = VALUES(Price),
            CryptoChange = VALUES(CryptoChange),
            Sparklingline = VALUES(Sparklingline)
    `;

    const values = [
        uuid, Cryptoprice_ID, 'USD', timeInterval, numberOfMarkets, 
        numberOfExchanges, volume24h, marketCap, fullyDilutedMarketCap, 
        price, change, sparkline
    ];

    try {
        const result = await db.getquery(insertQuery, values);
        console.log(`Price data for ${coinData.name} (${timeInterval}) inserted/updated successfully.`);
        return result;
    } catch (error) {
        console.error(`Error inserting price data for ${coinData.name} (${timeInterval}): ${error.message}`);
        throw error;
    }
};

// Send email notification
const sendCompletionEmail = async () => {
    const email = process.env.AdminEmail;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Crypto Data Load Completed',
        text: `Hello,\n\nAll cryptocurrency data has been successfully loaded into the database.\n\nRegards,\nCrypto Tracker`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending completion email: ${error.message}`);
    }
};

const fetchAllCryptoData = async (listOfUUID, timeIntervals) => {
    try {
        for (let uuid of listOfUUID) {
            for (let interval of timeIntervals) {
                const coinData = await fetchCryptoData(uuid, interval);
                coinData.timeInterval = interval; // Add time interval to coin data
                await insertCryptoPriceData(coinData);
            }
        }
        await sendCompletionEmail();
    } catch (error) {
        console.error(`Error in fetchAllCryptoData: ${error.message}`);
        throw error;
    }
};

module.exports = {
    fetchCryptoData,
    insertCryptoPriceData,
    fetchAllCryptoData
};
