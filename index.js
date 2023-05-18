const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5100;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

// mongoDB

const uri = `mongodb+srv://${process.env.DB_USR}:${process.env.DB_PASS}@clustersss.lzzpxzj.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db("pixelDB").collection("toys");
    // get all data
    app.get("/toys", async (req, res) => {
      const result = await toysCollection.find({}).limit(20).toArray();
      res.send(result);
    });
    // search by name
    app.get("/getToys/:text", async (req, res) => {
      const text = req.params.text;
      const result = await toysCollection
        .find({
          $or: [{ toyName: { $regex: text, $options: "i" } }],
        })
        .toArray();
      res.send(result);
    });
    //get a single data
    app.get('/toys/:id', async (req, res) =>{
        const id = req.params.id;
        const result = await toysCollection.findOne({_id: new ObjectId(id)})
        res.send(result)
    })

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
  res.send("Pixel is running");
});

app.listen(port, () => {
  console.log("Listening from ", port);
});
