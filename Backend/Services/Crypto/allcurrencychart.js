const db=require('../../Database/ConnectDb');

const fetchallcurrencychart = async (req, res) => {
    try {
        const chartquery = `
            SELECT cc.Crypto_Name, cc.Crypto_image, cp.Price, cp.24HVolume, cp.Sparklingline, cp.Currency
            FROM Crypto_Currencies cc
            INNER JOIN Crypto_price cp ON cc.UUID = cp.UUID
            WHERE cp.timeInterval = '24h'
        `;
        
        const chartqueryresult = await db.getquery(chartquery);

        if (chartqueryresult.length === 0) {
            return res.status(404).send({ status: 'error', message: 'No data found' });
        }

        const cleanedData = chartqueryresult.map(item => {
            let sparklingline;
            try {
                sparklingline = JSON.parse(item.Sparklingline.replace(/\\/g, ''));
            } catch (error) {
                sparklingline = [];
            }

            return {
                ...item,
                Sparklingline: sparklingline,
            };
        });

        return res.status(200).send({
            status: 'success',
            data: cleanedData
        });

    } catch (err) {
        return res.status(500).send({ error: { message: `Error in fetching data: ${err.message}` } });
    }
};


module.exports={
    fetchallcurrencychart
}