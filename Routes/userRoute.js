const express = require("express");
const userRoute = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const userCollection = client.db("cStore").collection("user");

userRoute.post("/", async (req, res) => {
  const user = req.body;
  const hashedPassword = await bcrypt.hash(user.password, 5);
  console.log(hashedPassword);
  res.send(hashedPassword);
});

module.exports = userRoute;
