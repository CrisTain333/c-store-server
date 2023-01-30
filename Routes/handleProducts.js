const express = require("express");
const handleProducts = express.Router();

handleProducts.get("/", async (req, res) => {
  res.send("product home route working");
});

module.exports = handleProducts;
