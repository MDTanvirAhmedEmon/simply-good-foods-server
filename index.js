const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const usersCollection = db.collection("user");

    app.get("/products", async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.send({ status: true, data: products });
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id; 
      const products = await productsCollection.findOne({ _id: new ObjectId(id)});
      res.send({ status: true, data: products });
    });

    app.post("/signup", async (req, res) => {
      const { name, email, password, number, address } = req.body;
      const isExist = await usersCollection.findOne({email});
      if(isExist) {
        return res.send({ status: false, data:{message: 'user already exists'}})
      }
      await usersCollection.insertOne({
        name,
        email,
        address,
        number,
        password
      })
      res.send({ status: true, data:{message: 'sign up successfully'}})
    })
    

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      console.log('pass form', password);
      const isExist = await usersCollection.findOne({email});
      if(!isExist) {
        return res.send({ status: false, data:{message: 'user does not exists'}})
      }
      console.log(isExist.password);
      
      if(isExist.password !== password) {
        return res.send({ status: false, data:{message: 'wrong password'}})
      }

      res.send({ status: true, data:{message: 'log in successfully'}})
    })


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