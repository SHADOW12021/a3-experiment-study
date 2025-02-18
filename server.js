const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

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
    const database = client.db("experimentDB");
    const collection = database.collection("results");

    const result = await collection.insertOne(req.body);
    res.json({ message: "Success", insertedId: result.insertedId });
    console.log("Data saved:", req.body);
  } catch (error) {
    console.error("Error saving data:", error);
    res.json({ message: "Error", error: error });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
