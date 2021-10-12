const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();
// const {MongoClient} = require('mongodb');
require('dotenv').config();


app.use(bodyParser.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.msfnz.mongodb.net/${process.env.ema-john-store}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(`${process.env.ema-john-store}`).collection(`${process.env.DB_COLLECTION}`);
    // console.log('Database Connected')
    // Database POST
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(product)
        collection.insertMany(products)
            .then(result => {
                // console.log(result);
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    // Read data from the Server
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((error, documents) => {
                res.send(documents)
            })
    })

    // Read data from the Server
    app.get('/product/:key', (req, res) => {
        collection.find({key: req.params.key})
            .toArray((error, documents) => {
                res.send(documents[0])
            })
    })
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is Running http://localhost:${process.env.PORT || port}`)
})

