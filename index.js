const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const cors = require('cors')

const app = express()
const port = 8000

app.get('/', (req, res) => {
    res.send("Hello from db it's Working")
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v8nsc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // collection.insertMany(product)
        collection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/product', (req, res) => {
     collection.find({})
     .toArray((err, documents) => {
        res.send(documents)
     })

    })

    app.get('/singleProduct/:key', (req, res) => {
     collection.find({key: req.params.key})
     .toArray((err, documents) => {
        res.send(documents[0])
     })

    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        collection.find({key: { $in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
         })
    })



    // ORDER API
    app.post('/orderProduct', (req, res) => {
        const order = req.body;
        // collection.insertMany(product)
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

});


app.listen(process.env.PORT || port)