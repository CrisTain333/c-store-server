const express = require("express");
const handleOrder = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const jwt = require("jsonwebtoken");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const cartCollection = client.db("cStore").collection("cart");

// Middleware
function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ message: "You don't Have Permission to access" });
    }

    req.decoded = decoded;
    next();
  });
}

// Add to cart
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

// get all cart items

handleOrder.get("/:email", verifyJwt, async (req, res, next) => {
  try {
    const filter = { email: req.params.email };
    const result = await cartCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
    next();
  }
});

// delete a product
handleOrder.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const filter = { productId: id };
    const result = await cartCollection.deleteOne(filter);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = handleOrder;
