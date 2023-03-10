const express = require("express");
const userRoute = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const userCollection = client.db("cStore").collection("user");

//Get User
userRoute.get("/:email", async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await userCollection.findOne({ email: email });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (user) {
      res.status(200).json({ status: 200, token: token, user: user });
    } else {
      res.status(404).json({ status: 401, message: "User Not Found" });
    }
  } catch (error) {
    console.log(error);
    next();
  }
});

// saveUser
userRoute.post("/", async (req, res, next) => {
  try {
    const userInfo = req.body;
    const hashedPassword = await bcrypt.hash(userInfo.password, 5);
    const { name, email, profilePicture } = userInfo;
    const user = {
      name,
      email,
      profilePicture,
      password: hashedPassword,
    };

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const result = await userCollection.insertOne(user);
    if (result.acknowledged) {
      res.status(200).send({ status: 200, token: token });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ errorMessage: "Authentication failed" });
    next();
  }
});

module.exports = userRoute;
