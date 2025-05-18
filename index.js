const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 2100;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster21.x54inhf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster21`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    const usersCollection = client.db("coffeeDB").collection("users");

    //get/read
    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      // console.log(query)
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    //create/post
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      // console.log(req.body)
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    //update/patch
    app.put(`/coffees/:id`, async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: updatedCoffee,
      };
      const options = { upsert: true };
      const result = await coffeeCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //delete
    app.delete(`/coffees/:id`, async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) };
      // console.log(query)
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    //users relates APIs

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    //id/only one user
    // app.get('/users/:id' , async(req, res) =>{
    //   const query = {_id : new ObjectId(req.params.id)}
    //   const result = await usersCollection.findOne(query)
    //   res.send(result)
    // })

    app.post("/users", async (req, res) => {
      const userProfile = req.body;
      console.log(userProfile);
      const result = await usersCollection.insertOne(userProfile);
      res.send(result);
    });

    //update time on signin
    app.patch("/users", async (req, res) => {
      const { email, lastSignIn } = req.body;
      // console.log(req);
      const filter = { email: email };
      const updateDoc = {
        $set: {
          lastSignIn: lastSignIn,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //delete
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log(req);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Hot Hot Coffee Shop Server");
});

app.listen(port, () => {
  console.log(`Port is running on : ${port}`);
});
