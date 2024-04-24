const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

// middleware
app.use(cors());
app.use(express.json());


//``````````````mongodb``````````````
//mahim_coffee_khai;
//NBPVqIVxKo1NVr8z;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jt5df8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb://localhost:27017`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Connect to the "coffeeDB" database and access its "CoffeeCollection" collection
        const database = client.db("coffeeDB")
        const coffeeCollection = database.collection("CoffeeCollection");

        app.get('/coffee', async (req, res) => {
            const cursor = await coffeeCollection.find({}).toArray();
            res.send(cursor)
        })
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const coffee = await coffeeCollection.findOne(query);
            res.send(coffee)
            // console.log(coffee);
        })

        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            // Insert the defined document into the  coffeeCollection" collection
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result);
            // console.log(result);
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const coffee = req.body;
            const { name, supplier, category, chef, taste, details, photo } = coffee
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name, supplier, category, chef, taste, details, photo
                },
            };
            // Update the first document that matches the filter
            const result = await coffeeCollection.updateOne(filter, updateDoc, options);
            // console.log(result)
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })

        // ---user apis---
        const coffeeUserCollection = database.collection('coffeeUserCollection')

        app.get('/users', async (req, res) => {
            const cursor = await coffeeUserCollection.find({}).toArray();
            res.send(cursor)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await coffeeUserCollection.insertOne(user);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeUserCollection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // finally kichu korar nai
    }
}
run().catch(console.dir);
//____mbd_____


app.get('/', (req, res) => {
    res.send('Coffee khete welcome ')
})

app.listen(port, () => {
    console.log(`Coffee server is running on port😂 ${port}`)
})