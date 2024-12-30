var express = require('express');
var router = express.Router();
const products = require('../module/products');
const multer = require('multer');

// Multer setup for file uploads (store files in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fieldNameSize: 300,
      fileSize: 1048576, // 1 Mb allowed
    }// 限制文件大小为 10MB
});

router.get('/:productID/verify', async (req, res) => {
  try {
    const productID = req.params.productID;
    const product = await products.findById(productID);

    if (product) {
      res.json({ productID: product._id }); // 返回产品 ID
    } else {
      res.json({ error: 'Product not found' }); // 如果产品不存在
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.json({ error: 'Server error' });
  }
});

// password verify
router.post('/:productID/verify', async (req, res, next) => {
  try {
    const productID = req.params.productID;
    const { password } = req.body;

    // find product and verify password
    const product = await products.findById(productID);

    if (product && product.password === password) {
      // password match
      res.status(200).json({ message: 'Password verified successfully' });
    } else {
      // Password doesn't match
      res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    next(error);
  }
});


// display the edit page
router.get('/:productID', async (req, res, next) => {
  try {
    const productID = req.params.productID;
    const product = await products.findById(productID); // Fetch product by ID

    if (product) {
      // Render edit page with product data
      res.json(product);
    } else {
      // Product not found, send 404 response
      res.status(404).json("Product does not exist");
    }
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
});

// Route to handle updating the product
router.put('/:productID', upload.single('imageURL'), async (req, res, next) => {
  try {
    const productID = req.params.productID;
    // if any delete action
    console.log(`this is my delete message: ${req.body.delete}`);
    console.log(`this is my title message: ${req.body.title}`);
    console.log(`the file is : ${req.file}`);
    if (req.body.delete) {
      await products.findByIdAndDelete(productID);
      //back to the home page, once the post is deleted
      return res.json({message: 'Product deleted successfully', productID}); 
    }
    const { title, seller, contact, imageURL, description, condition, price, category, location, status } = req.body;
    const updatedStatus = status === 'Unavailable' ? 'Unavailable' : 'Available';
    //console.log(`type the name to me: ${seller}`);

    // Get the existing product to preserve the image if no new one is uploaded
    const existingProduct = await products.findById(productID);
    
    const image = req.file ? req.file.buffer.toString('base64') : existingProduct.imageURL;

    // Update the product in the database with new data
    await products.findByIdAndUpdate(productID, {
      title,
      seller,
      contact,
      imageURL: image,
      description,
      condition,
      price,
      category,
      location,
      status: updatedStatus
    });

    // Redirect back to the product details page after update
    res.json({message: 'Product updated successfully', productID});
  } catch (error) {
    next(error); // Pass any errors to the error-handling middleware
  }
});



module.exports = router;