const express = require('express');
const path = require('path');
const db = require('./Database/ConnectDb');
const cors = require('cors');

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
