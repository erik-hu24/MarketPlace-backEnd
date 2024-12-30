var express = require('express');
var router = express.Router();
const products = require('../module/products');

/* GET all products with pagination and search */
router.get('/', function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const searchQuery = req.query.query || ""; // 获取搜索关键词

  // 添加搜索过滤条件
  const filter = searchQuery
    ? { title: { $regex: searchQuery, $options: "i" } } // 搜索产品标题，忽略大小写
    : {};

  products.find(filter)
    .then(allProducts => {
      const totalProducts = allProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const startIndex = (page - 1) * limit;
      const productList = allProducts.slice(startIndex, startIndex + limit);

      res.json({
        productList,
        currentPage: page,
        totalPages,
        isAvailableOnly: false,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Error retrieving products" });
    });
});

/* GET available products with pagination and search */
router.get('/available', function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const searchQuery = req.query.query || ""; // 获取搜索关键词

  // 添加搜索过滤条件，并限定状态为 "Available"
  const filter = {
    status: "Available",
    ...(searchQuery && { title: { $regex: searchQuery, $options: "i" } }), // 搜索产品标题，忽略大小写
  };

  products.find(filter)
    .then(allProducts => {
      const totalProducts = allProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const startIndex = (page - 1) * limit;
      const productList = allProducts.slice(startIndex, startIndex + limit);

      res.json({
        productList,
        currentPage: page,
        totalPages,
        isAvailableOnly: true,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Error retrieving products" });
    });
});

/* GET product details by ID */
router.get('/product/:productID', function (req, res, next) {
    const productID = req.params.productID;
    products.findById(productID)
      .then(product => {
        if (product) {
          res.json(product); // 返回对应 ID 的产品详情
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: "Error retrieving product details" });
      });
});

module.exports = router;
