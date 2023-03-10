const express = require("express");
const handlePayment = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const cartCollection = client.db("cStore").collection("cart");
const uniqid = require("uniqid");
handlePayment.post("/init", async (req, res) => {
  const { id, email } = req.body;

  const userProduct = await cartCollection.findOne({
    productId: id,
    email: email,
  });

  const total = userProduct.productPrice * userProduct.productQuantity;
  const transactionId = uniqid();
  const data = {
    total_amount: total,
    currency: "BDT",
    tran_id: transactionId, // use unique tran_id for each api call
    success_url: `http://localhost:5000/payment/success?transactionId=${transactionId}`,
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then(async (apiResponse) => {
    let GatewayPageURL = apiResponse.GatewayPageURL;
    const result = await cartCollection.updateOne(
      {
        productId: id,
        email: email,
      },
      {
        $set: {
          totalPrice: total,
          transactionId,
          paid: false,
        },
      }
    );
    res.json({ url: GatewayPageURL });
  });
});

// send Success api  to frontend
handlePayment.post("/success", async (req, res, next) => {
  const { transactionId } = req.query;
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;
  const result = await cartCollection.updateOne(
    { transactionId: transactionId },
    {
      $set: {
        paid: true,
        paidAt: currentDate,
      },
    }
  );
  if (result.modifiedCount > 0) {
    res.redirect(
      `http://localhost:3000/payment/success?transactionId=${transactionId}`
    );
  }
});

module.exports = handlePayment;
