const express = require("express");
const handleOrder = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const cartCollection = client.db("cStore").collection("cart");

handleOrder.post("/", async (req, res, next) => {
  const carts = req.body;
  //   const result = await cartCollection.insertOne(cart);
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
    console.log(quantity);
    const filter = { email: checkAllReadyExits.email };
    const updatedDoc = {
      $set: {
        productQuantity: quantity + 1,
      },
    };
    const result = await cartCollection.updateOne(filter, updatedDoc);
    console.log(result);
  } else {
    console.log(false);
  }
  //   console.log(checkAllReadyExits);
  res.send("ok");
});

module.exports = handleOrder;
