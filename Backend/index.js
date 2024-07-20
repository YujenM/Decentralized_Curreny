const express=  require('express');
const db=require('./Database/ConnectDb');
const cors=require('cors');
db.connection((err, connection) => {
    if (err) {
        console.error(err);
        return;
    }
    else{
        console.log('Connected to database');
    }
});

db.getquery('SELECT * FROM your_table', (err, result) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(result);
});
const app=express();
const port=2000;
app.listen(port,()=>{
    console.log(`server connected at ${port}`);
})
app.use(cors())
app.get('/',(req,res)=>{
    res.send('Hello World');
})   