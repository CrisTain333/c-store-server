const express = require("express");
const handleOrder = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const cartCollection = client.db("cStore").collection("cart");

handleOrder.post("/", async (req, res, next) => {
  try {
    const carts = req.body;
    const checkAllCart = await cartCollection
      .find({
        email: carts.email,
      })
      .toArray();
    const checkAllReadyExits = checkAllCart.find(
      (cart) => cart.productId === carts.productId
    );
    if (checkAllReadyExits) {
      const quantity = checkAllReadyExits.productQuantity;
      const filter = { email: checkAllReadyExits.email };
      const updatedDoc = {
        $set: {
          productQuantity: quantity + 1,
        },
      };
      const result = await cartCollection.updateOne(filter, updatedDoc);
      res.send(result);
    } else {
      const result = await cartCollection.insertOne(carts);
      res.send(result);
    }
  } catch (error) {
    console.log(error);
    next();
  }
});

handleOrder.get("/:email", async (req, res, next) => {
  try {
    const filter = { email: req.params.email };
    const result = await cartCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = handleOrder;
