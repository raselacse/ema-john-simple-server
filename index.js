const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
const port = 5000


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muahx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    app.post('/addProduct',(req, res)=>{
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result =>{
            res.send(result.insertedCount)
        })
    })
    app.get('/products',(req, res)=>{
        const search = req.query.search;
        productsCollection.find({name: {$regex: search}})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })
    app.get('/product/:key',(req, res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((err, documents)=>{
            res.send(documents[0])
        })
    })
    app.post('/productsByKeys',(req, res)=>{
        const proudctkeys = req.body;
        productsCollection.find({key: {$in: proudctkeys}})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })
    app.post('/addOrder',(req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})