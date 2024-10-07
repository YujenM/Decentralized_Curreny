const axios = require('axios');
const db = require('../../Database/ConnectDb');

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const randomnum = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
};

const fetchCryptoData = async (uuid, timePeriod) => {
    try {
        const apiUrl = `https://api.coinranking.com/v2/coin/${uuid}`;
        
        const options = {
            method: 'GET',
            url: apiUrl,
            params: { timePeriod },
            headers: {
                'x-rapidapi-key': 'your-rapidapi-key',
                'x-rapidapi-host': 'coinranking1.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        return response.data.data.coin;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.log(`Rate limit hit, sleeping for 1 second...`);
            await sleep(1000); 
            return await fetchCryptoData(uuid, timePeriod);
        } else if (error.response && error.response.status === 422) {
            throw new Error(`Invalid data for UUID: ${uuid}, timePeriod: ${timePeriod}`);
        } else {
            throw new Error(`Request failed for UUID: ${uuid}, timePeriod: ${timePeriod}: ${error.message}`);
        }
    }
};

const deletePreviousData = async (uuid, timePeriod) => {
    const deleteQuery = `
        DELETE FROM Crypto_price 
        WHERE UUID = ? AND timeInterval = ?
    `;

    try {
        await db.getquery(deleteQuery, [uuid, timePeriod]);
        console.log(`Previous data for UUID: ${uuid} and time period: ${timePeriod} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting previous data for UUID: ${uuid}, Time Period: ${timePeriod}: ${error.message}`);
        throw error;
    }
};

const insertCryptoPriceData = async (coinData, timePeriod) => {
    let Cryptoprice_ID = '';
    let isUnique = false;
    while (!isUnique) {
        let randomnumber = randomnum();
        Cryptoprice_ID = `MARK-${randomnumber}`;
        const checkidquery = 'SELECT * FROM Crypto_price WHERE Cryptoprice_ID=? AND timeInterval=?';
        const checkidresults = await db.getquery(checkidquery, [Cryptoprice_ID, timePeriod]);
        if (checkidresults.length === 0) {
            isUnique = true;
        }
    }

    const uuid = coinData.uuid;
    const price = coinData.price;
    const numberOfMarkets = coinData.numberOfMarkets;
    const numberOfExchanges = coinData.numberOfExchanges;
    const volume24h = coinData["24hVolume"];
    const marketCap = coinData.marketCap;
    const fullyDilutedMarketCap = coinData.fullyDilutedMarketCap;
    const change = coinData.change;
    const sparkline = JSON.stringify(coinData.sparkline); 

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
        uuid, Cryptoprice_ID, 'USD', timePeriod, numberOfMarkets, 
        numberOfExchanges, volume24h, marketCap, fullyDilutedMarketCap, 
        price, change, sparkline
    ];

    try {
        const result = await db.getquery(insertQuery, values);
        console.log(`Price data for ${coinData.name} (${timePeriod}) inserted/updated successfully.`);
        return result;
    } catch (error) {
        console.error(`Error inserting price data for ${coinData.name}: ${error.message}`);
        throw error;
    }
};

const fetchAllCryptoData = async (listOfUUID, timePeriods) => {
    for (let uuid of listOfUUID) {
        for (let timePeriod of timePeriods) {
            try {
                await deletePreviousData(uuid, timePeriod); 
                const coinData = await fetchCryptoData(uuid, timePeriod);
                await insertCryptoPriceData(coinData, timePeriod);
                console.log(`Data for ${coinData.name} (${timePeriod}) inserted successfully`);
            } catch (error) {
                console.error(`Error for UUID: ${uuid}, Time Period: ${timePeriod}: ${error.message}`);
            }
        }
    }
};

module.exports = {
    fetchCryptoData,
    insertCryptoPriceData,
    fetchAllCryptoData
};