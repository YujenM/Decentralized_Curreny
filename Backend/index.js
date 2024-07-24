const express = require('express');
const db = require('./Database/ConnectDb');
const cors = require('cors');

db.connection((err, connection) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to database');
    }
});

// checking database
db.getquery('SELECT * FROM Users WHERE user_id = 1', (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(result);
});

const app = express();
const port = 2000;
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth/auth');
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server connected at ${port}`);
});
