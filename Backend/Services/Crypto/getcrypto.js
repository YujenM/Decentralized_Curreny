const axios = require('axios');
const db = require('../../Database/ConnectDb');

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
            await sleep(1000); // Sleep for 1 second when rate-limited
            return await fetchCryptoData(uuid, timePeriod); // Retry after sleeping
        } else if (error.response && error.response.status === 422) {
            throw new Error(`Invalid data for UUID: ${uuid}, timePeriod: ${timePeriod}`);
        } else {
            throw new Error(`Request failed for UUID: ${uuid}, timePeriod: ${timePeriod}: ${error.message}`);
        }
    }
};

const insertCryptoData = async (coinData) => {
    const uuid = coinData.uuid;
    const name = coinData.name;
    const symbol = coinData.symbol;
    const iconUrl = coinData.iconUrl;
    const description = coinData.description;
    const websiteUrl = coinData.websiteUrl;
    const rank = coinData.rank;

    const insertQuery = `
        INSERT INTO Crypto_Currencies (UUID, Crypto_Name, Crypto_Symbol, Crypto_image, Crypto_Discription, Crypto_Websiteurl, Crypto_Rank)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            Crypto_Name = VALUES(Crypto_Name),
            Crypto_Symbol = VALUES(Crypto_Symbol),
            Crypto_image = VALUES(Crypto_image),
            Crypto_Discription = VALUES(Crypto_Discription),
            Crypto_Websiteurl = VALUES(Crypto_Websiteurl),
            Crypto_Rank = VALUES(Crypto_Rank)
    `;

    const values = [uuid, name, symbol, iconUrl, description, websiteUrl, rank];

    try {
        const result = await db.getquery(insertQuery, values);
        console.log(`Data for ${name} inserted/updated successfully.`);
        return result;
    } catch (error) {
        console.error(`Error inserting data for ${name}: ${error.message}`);
        throw error;
    }
};

const fetchAllCryptoData = async (listOfUUID, timePeriods) => {
    for (let uuid of listOfUUID) {
        for (let timePeriod of timePeriods) {
            try {
                const coinData = await fetchCryptoData(uuid, timePeriod);
                await insertCryptoData(coinData);
                console.log(`Data for ${coinData.name} (${timePeriod}) inserted successfully`);
            } catch (error) {
                console.error(`Error for UUID: ${uuid}, Time Period: ${timePeriod}: ${error.message}`);
            }
        }
    }
};

module.exports = {
    fetchCryptoData,
    insertCryptoData,
    fetchAllCryptoData
};
