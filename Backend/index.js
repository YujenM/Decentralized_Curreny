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

// Serve the index.html on the root URL
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'routes/crypto/index.html'));
// });

// Define your routes
const authRoutes = require('./routes/auth/auth');
const cryptoRoutes = require('./routes/crypto/Addcrypto');
const getcryptoprice=require('./routes/getcryptoprice/getcryptoprice');
const getdecentralizedata=require('./routes/getdecentralizedata/prediction');
const coincryptoadd = require('./routes/crypto/coincrypto');

app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);

app.use('/api/getcryptoprice',getcryptoprice);
app.use('/api/getdata',getdecentralizedata);

app.use('/api/coincrypto', coincryptoadd);

const coincryptoprice=require('./routes/crypto/coincryptoprice');
app.use('/api/getcoincryptoprice',coincryptoprice)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
