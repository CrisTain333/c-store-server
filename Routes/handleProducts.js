const express = require("express");
const handleProducts = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const productCollection = client.db("cStore").collection("products");

// Get Category
handleProducts.get("/category", async (req, res, next) => {
  try {
    const filter = {};
    const result = await productCollection.find(filter).toArray();
    const category = result.map((x) => {
      return x.category;
    });
    let unique = category.filter((v, i, a) => a.indexOf(v) === i);
    res.status(200).send(unique);
  } catch (error) {
    console.log(error);
    next();
  }
});

// Get Products
handleProducts.get("/:category", async (req, res, next) => {
  try {
    const category = req.params.category;
    console.log(category);
    let filter = {};
    if (category === "all") {
      const result = await productCollection
        .find({})

        .toArray();
      res.status(200).send(result);
    } else {
      filter = { category: category };
      console.log(filter);
      const result = await productCollection.find(filter).toArray();
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = handleProducts;
