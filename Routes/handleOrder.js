const express = require("express");
const handleOrder = express.Router();

handleOrder.get("/", async (req, res, next) => {
  res.send("runing");
});

module.exports = handleOrder;
