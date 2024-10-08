const db = require('../../Database/ConnectDb');
const { formatDistanceToNow } = require('date-fns');

const getLatestNews = async (req, res) => {
    try {
        let limit = parseInt(req.params.limit, 10);
        if (isNaN(limit) || limit <= 0) {
            limit = 5;
        }

        const newsQuery = 'SELECT NewsID NEWS, NewsTitle, Created_at FROM NEWS ORDER BY Created_at DESC LIMIT ?;';
        const newsQueryResult = await db.getquery(newsQuery, [limit]);

        if (newsQueryResult.length === 0) {
            return res.status(404).send('No Latest news');
        }

        const newsWithFormattedTime = newsQueryResult.map(news => {
            const timeAgo = formatDistanceToNow(new Date(news.Created_at), { addSuffix: true });
            return { ...news, timeAgo };
        });

        return res.status(200).send(newsWithFormattedTime);

    } catch (err) {
        throw new Error(`Error in getLatestNews ${err}`);
    }
};

module.exports = {
    getLatestNews
};
