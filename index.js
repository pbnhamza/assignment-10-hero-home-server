const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

//user: hero-db
//password: uthPnQqN4OUS9LDr
const uri =
  "mongodb+srv://hero-db:uthPnQqN4OUS9LDr@cluster0.3r2qvfc.mongodb.net/?appName=Cluster0";
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
    //all data find
    app.get("/hero", async (req, res) => {
      const result = await heroCollection.find().sort({ Price: -1 }).toArray();

      res.send(result);
    });
    //Latest 6 card home page
    app.get("/latest-hero", async (req, res) => {
      const result = await heroCollection
        .find()
        .sort({ Price: -1 })
        .limit(6)
        .toArray();

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
      // console.log(id)
      // console.log(data)
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
  res.send("Home Hero server is Running ok ");
});

app.listen(port, () => {
  console.log(`Home Hero Server start on Port ${port}`);
});
