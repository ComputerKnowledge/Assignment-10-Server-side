require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("It is a server for Assignment 10");
});

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zuqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zuqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB").collection("users");
    const database1 = client.db("usersDB").collection("campaigns");
    const database2 = client.db("usersDB").collection("donations");

    // API'S OF USERS COLLECTION STARTS HERE.
    //  API FOR ALL USERS
    app.get("/users", async (req, res) => {
      const cursor = await database.find().toArray();
      res.send(cursor);
    });

    // API FOR SINGLE USER
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("please delete the", id);
      const query = { _id: new ObjectId(id) };
      const result = await database.findOne(query);
      res.send(result);
    });

    // API TO ADD NEW USER
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const doc = {
        title: "Record of a Shriveled Datum",
        content: "No bytes, no problem. Just insert a document, in MongoDB",
      };

      // console.log(data);
      const result = await database.insertOne(doc);
      res.send(result);
    });

    // API TO DELETE A USER
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("please delete the", id);
      const query = { _id: new ObjectId(id) };
      const result = await database.deleteOne(query);
      res.send(result);
    });

    // API TO UPDATE USER'S DATA
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updataUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await database.updateOne(filter, updataUser, option);

      res.send(result);
    });

    // API'S OF CAMPAIGNS COLLECTION STARTS HERE.
    // API'S FOR ALL CAMPAIGNS
    app.get("/campaigns", async (req, res) => {
      const cursor = await database1.find().toArray();
      res.send(cursor);
    });

    // API FOR SINGLE CAMPAIGN
    app.get("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await database1.findOne(query);
      res.send(result);
    });

    // API TO ADD NEW CAMPAIGN
    app.post("/addCampaign", async (req, res) => {
      const user = req.body;
      console.log("new user", user);

      const result = await database1.insertOne(user);
      res.send(result);
    });

    // API TO DELETE A CAMPAIGN
    app.delete("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await database1.deleteOne(query);
      res.send(result);
    });

    // API TO UPDATE CAMPAIGN'S DATA
    app.put("/updateCampaign/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedCampaign = req.body;
      console;

      const campaign = {
        $set: {
          title: updatedCampaign.title,
          type: updatedCampaign.type,
          description: updatedCampaign.description,
          amount: updatedCampaign.amount,
          date: updatedCampaign.date,
          email: updatedCampaign.email,
          name: updatedCampaign.name,
        },
      };
      const result = await database1.updateOne(filter, campaign, option);
      res.send(result);
    });

    // API FOR MY CAMPAIGN
    app.get("/myCampaign/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email: email };
      const result = await database1.find(query).toArray();
      res.send(result);
    });

    // API'S OF DONATION COLLECTION STARTS HERE.
    // API FOR MY DONATION
    app.get("/donations", async (req, res) => {});

    // API FOR ADD DONATION
    app.post("/donations", async (req, res) => {});

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

app.listen(port, () => {
  console.log(`The port number is ${port}`);
});
