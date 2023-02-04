const express = require("express");
const handlePayment = express.Router();

handlePayment.get("/", async (req, res) => {
  res.json({ status: 400 });
});

module.exports = handlePayment;
