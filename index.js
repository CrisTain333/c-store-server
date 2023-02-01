const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");

const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require("dotenv").config();
const productRoute = require("./Routes/handleProducts");
const userRoute = require("./Routes/userRoute");
const orderRoute = require("./Routes/handleOrder");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicebaba.aon4ndq.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.get("/", (req, res) => {
  res.send("C-store Server On Fire");
});

// Product Routes
app.use("/products", productRoute);
//User  Routes
app.use("/user", userRoute);

//handle Order & Cart
app.use("/order", orderRoute);

app.listen(PORT, () => {
  console.log(`Betacom server Running On Port ${PORT} `);
  client.connect((err) => {
    if (err) {
      return console.log(err);
    }
    console.log("Connected To Database");
  });
});
