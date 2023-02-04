const express = require("express");
const handlePayment = express.Router();
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

handlePayment.get("/", async (req, res) => {
  res.json({ status: 400 });
});

module.exports = handlePayment;
