const db = require('../../Database/ConnectDb');
const axios = require('axios');

const generateSixDigitId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
};

const fetchnewsdata = async () => {
    try {
        const newsurl = `https://cryptocurrency-news2.p.rapidapi.com/v1/coindesk`;
        const options = {
            method: 'GET',
            url: newsurl,
            headers: {
                'x-rapidapi-key': process.env.Newsapi,
                'x-rapidapi-host': 'cryptocurrency-news2.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        return response.data;
    } catch (err) {
        throw new Error(`Error fetching news data: ${err.message}`);
    }
};

const deletePreviousdata = async () => {
    const deletequery = 'DELETE FROM NEWS';
    await db.getquery(deletequery);
};

const addNews = async (req, res) => {
    try {
        

        const newsdata = await fetchnewsdata();

        if (!Array.isArray(newsdata.data)) {
            throw new Error('newsdata.data is not an array');
        }

        await deletePreviousdata();

        const newsInsertQuery = "INSERT INTO NEWS(NewsID, NewsTitle, NewDescription, NewsUrl, Tumbnail, Created_at) VALUES(?, ?, ?, ?, ?, ?)";

        for (let newsItem of newsdata.data) {
            let news_id = '';
            let isUnique = false;

            while (!isUnique) {
                let randomID = generateSixDigitId();
                // console.log('randomID:', randomID);
                news_id = `MARK-NEWS-${randomID}`;
                const checkIdQuery = 'SELECT * FROM NEWS WHERE NewsID = ?';
                const checkIdResults = await db.getquery(checkIdQuery, [news_id]);
                if (checkIdResults.length === 0) {
                    isUnique = true;
                }
            }
            const newsValues = [
                news_id,
                newsItem.title,
                newsItem.description,
                newsItem.url,
                newsItem.thumbnail,
                newsItem.createdAt
            ];
            await db.getquery(newsInsertQuery, newsValues);
        }

        res.status(200).send({
            status: 'success',
            message: 'News data inserted successfully'
        });
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: `Error adding news data: ${err.message}`
        });
    }
};

module.exports = {
    addNews
};
