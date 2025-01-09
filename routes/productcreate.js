var express = require('express');
var router = express.Router();
const multer = require('multer');
const products = require('../module/products');
const users = require('../module/users');

// Multer setup for file uploads (store files in memory)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldNameSize: 300,
        fileSize: 1048576, // 1 Mb allowed
      }// 限制文件大小为 10MB
});

function generateRandomPassword(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
}

// router to get user information
router.get("/:username", async (req, res) => {
    const { username } = req.params;
    try {
      // find user in DB
      const user = await users.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    
      res.json({ email: user.email, username: user.username });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error of getting user information" });
    }
  });

// display the create page
router.get('/', function(req, res, next) {
    res.json({message:"create a post of product"});
});

// user create product
router.post('/', upload.single('imageURL'), function(req, res, next){
    const { title, seller, description, price, condition, location, category, contact, useremail, username } = req.body;
    const productPassword = generateRandomPassword(10);
    
    // Convert uploaded file to Base64
    const imageURL = req.file ? req.file.buffer.toString('base64') : null;

    // create a new product in Database
    products.create({
        title,
        seller,
        imageURL: imageURL,
        description,
        price,
        condition,
        location,
        contact,
        password: productPassword,
        category,
        status: 'Available',
        useremail,
        username
    })
    // after user submit the new product information successfully
    .then(() =>{
        res.json({
            productPassword
        });
    })
    // error to submit
    .catch(err => {
        console.error("Error creating product:", err);
        res.status(500).send("Failed to create product.");
    });
});

module.exports = router;