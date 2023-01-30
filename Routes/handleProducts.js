const express = require("express");
const handleProducts = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const productCollection = client.db("cStore").collection("products");

handleProducts.get("/", async (req, res) => {
  const filter = {};
  const result = await productCollection.find(filter).toArray();
  res.status(200).send(result);
});

module.exports = handleProducts;
