const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oj1ojow.mongodb.net/?appName=Cluster0`;

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
    const db = client.db("simple-food");
    const productsCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.send({ status: true, data: products });
    });

  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })