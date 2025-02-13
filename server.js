const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.use(express.static("public"));

app.post("/submit", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("test");

    const result = await collection.insertOne(req.body);
    res.json({ message: "Success", data: result.ops });
    console.log("Worked");
  } catch (error) {
    res.json({ message: "Error", error: error });
    console.log("Failed");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
