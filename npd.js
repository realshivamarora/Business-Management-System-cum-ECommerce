const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

let db;
async function connectToDb(){
    try{
        await client.connect();
        db = client.db('AroraGarments');
        console.log('Connected to MongoDB');
    }
    catch(err){
        console.error(err);
    }
}
connectToDb();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/npd.html');
  });

app.post('/submit', async (req, res) => {
    const { FirmID, FirmName, FirmAddress, Phone, PaymentCleared,Mode, Date } = req.body;

    try{
        const result = await db.collection('pd').insertOne({FirmID, FirmName, FirmAddress, Phone, PaymentCleared,Mode, Date });
        console.log('User Inserted');
        res.send('User Inserted');
    }
    catch(err){
        console.error(err);
        res.send('Error');
    }
});

const PORT = process.env.PORT || 3038;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});