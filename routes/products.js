var express = require('express');
var router = express.Router();
const products = require('../module/products');

/* GET all products with pagination and search */
router.get('/', function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = 18;

   // 获取查询参数
   const category = req.query.category; // 筛选分类
   const searchQuery = req.query.query || ""; // 搜索关键词
 
   // 构建查询条件
   const query = {};
   if (category) {
     query.category = category; // 筛选条件：分类
   }
   if (searchQuery) {
     query.title = { $regex: searchQuery, $options: "i" }; // 搜索条件：标题包含关键词，忽略大小写
   }

  products.find(query)
    .sort({ createdAt: -1 })
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
  const limit = 18;
  const category = req.query.category; // 获取类别过滤条件
  const searchQuery = req.query.query || ""; // 获取搜索关键词

  // 构建查询条件
  const filter = {
    status: "Available", // 仅返回状态为 "Available" 的产品
    ...(category && { category }), // 如果有类别过滤条件，添加类别过滤
    ...(searchQuery && { title: { $regex: searchQuery, $options: "i" } }), // 如果有搜索关键词，按标题模糊搜索（忽略大小写）
  };


  products.find(filter)
    .sort({ createdAt: -1 })
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
