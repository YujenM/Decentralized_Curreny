const express = require('express');
const path = require('path');
const db = require('./Database/ConnectDb');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

db.connection((err) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log('Connected to database');
    }
});

const app = express();
const port = 2000;
app.use(cors());
app.use(express.json());



// Define your routes
const authRoutes = require('./routes/auth/auth');
const cryptoRoutes = require('./routes/crypto/Addcrypto');
const getcryptoprice=require('./routes/getcryptoprice/getcryptoprice');
const getdecentralizedata=require('./routes/getdecentralizedata/prediction');


app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);

app.use('/api/getcryptoprice',getcryptoprice);
app.use('/api/getdata',getdecentralizedata);


const coincryptoadd = require('./routes/crypto/coincrypto');
app.use('/api/coincrypto', coincryptoadd);

const coincryptoprice=require('./routes/crypto/coincryptoprice');
app.use('/api/getcoincryptoprice',coincryptoprice)

const getnewsroute=require('./routes/News/NewsRoutes');
app.use('/Markapi/News',getnewsroute);
const getportfolioroute=require('./routes/portfolionotification/portfolioroutes');
app.use('/Markapi/Portfolio',getportfolioroute);
const getweeklydata=require('./routes/geweeklydata/cryptocoinroute');
app.use('/Markapi/Weeklydata',getweeklydata);

const settingsroute=require('./routes/Settings/settingroutes');
app.use('/Markapi/Settings',settingsroute);

const PredictionRoute=require('./routes/Prediction/PredictionRoute.js');
app.use('/Markapi/Prediction',PredictionRoute);

const listOfUUID = ["Qwsogvtv82FCd", "razxDUgYGNAdQ", "25W7FG7om", "D7B1x_ks7WhV5", "dvUj0CzDZ"];
cron.schedule('0 * * * *', async () => {  
    const currentTime = new Date();
    const nextRunTime = new Date(currentTime.getTime() + 60 * 60 * 1000); 
    const formattedCurrentTime = currentTime.toLocaleString();
    const formattedNextRunTime = nextRunTime.toLocaleString();

    console.log(`Cron job triggered at ${formattedCurrentTime}`);
    console.log(`Next cron job scheduled to run at ${formattedNextRunTime}`);

    try {
        console.log("Triggering /addcryptos route via POST request...");
        await axios.post('https://decentralized-curreny.onrender.com/api/crypto/addcryptos', { listOfUUID });
        console.log("Crypto data fetch completed!");
    } catch (error) {
        console.error('Error triggering /addcryptos route:', error);
    }
    const timeDifference = nextRunTime - currentTime;
    console.log(`Time until next cron job: ${timeDifference / 1000} seconds`);
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
