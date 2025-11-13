const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3r2qvfc.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();

    const db = client.db("hero-db");
    const heroCollection = db.collection("hero");
    const bookingCollection = db.collection("bookings");

    //book API

    app.get("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const result = await bookingCollection.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });

    app.post("/bookings", async (req, res) => {
      const data = req.body;
      console.log("req body", data);
      const result = await bookingCollection.insertOne(data);
      res.send({ success: true, result });
    });

    //get bookings
    app.get("/bookings", async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    });

    //delete
    app.delete("/bookings/:id", async (req, res) => {
      const { id } = req.params;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        success: true,
        result,
      });
    });
    //All Hero API
    //all data find
    app.get("/hero", async (req, res) => {
      const result = await heroCollection.find().limit(6).toArray();

      res.send(result);
    });
    //Latest card home page
    app.get("/latest-hero", async (req, res) => {
      const result = await heroCollection.find().sort({ Price: -1 }).toArray();
      res.send(result);
    });
    //get only one data
    app.get("/hero/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const result = await heroCollection.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });
    //only data post
    app.post("/hero", async (req, res) => {
      const data = req.body;
      const result = await heroCollection.insertOne(data);
      res.send({ success: true, result });
    });
    //update
    app.put("/hero/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };

      const result = await heroCollection.updateOne(filter, update);
      res.send({
        success: true,
        result,
      });
    });
    // service delete
    app.delete("/hero/:id", async (req, res) => {
      const { id } = req.params;
      const result = await heroCollection.deleteOne({ _id: new ObjectId(id) });

      res.send({
        success: true,
        result,
      });
    });
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB! hello"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Home Hero server is Running ok ");
});

app.listen(port, () => {
  console.log(`Home Hero Server start on Port ${port}`);
});
