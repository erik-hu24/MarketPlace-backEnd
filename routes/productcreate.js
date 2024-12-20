var express = require('express');
var router = express.Router();
const products = require('../module/products');

function generateRandomPassword(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
}

// display the create page
router.get('/', function(req, res, next) {
    res.json({message:"create a post of product"});
});

// user create product
router.post('/', function(req, res, next){
    const { title, seller, imageURL, description, price, condition, location, contact } = req.body;
    const productPassword = generateRandomPassword(10);
    
    // create a new product in Database
    products.create({
        title,
        seller,
        imageURL,
        description,
        price,
        condition,
        location,
        contact,
        password: productPassword,
        status: 'Available'
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