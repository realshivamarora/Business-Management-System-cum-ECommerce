const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(express.static('public'));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToDb() {
    try {
        await client.connect();
        db = client.db('AroraGarments');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
}
connectToDb();

app.use(bodyParser.urlencoded({ extended: true }));

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the CSS file
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.post('/login', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        const user = await db.collection('userData').findOne({ Username, Password });
        if (user) { 
            console.log('Login Successful');
            res.redirect('http://localhost:3456/'); // Redirect to index.html on successful login
        } else {
            console.log('Invalid Username or Password');
            res.redirect('/'); // Redirect back to login page if credentials are incorrect
        }
    } catch (err) {
        console.error(err);
        res.send('Error');
    }
});

const PORT = process.env.PORT || 3045;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
