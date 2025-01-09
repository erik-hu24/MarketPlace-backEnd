const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// email sender
const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// purchase request 
router.post('/send-purchase-email', async (req, res) => {
  const { productTitle, price, seller, buyerName } = req.body;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: seller, // email of seller (product's username)
      subject: `New Purchase Request for ${productTitle}`,
      html: `
        <h2>New Purchase Request</h2>
        <p>Product: ${productTitle}</p>
        <p>Price: CA $${price}</p>
        <p>Buyer: ${buyerName}</p>
        <p>The buyer would like to purchase your item at the listed price.</p>
      `
    });
    //console.log(`${productTitle},${price},${seller},${buyerName}`);
    res.status(200).json({ message: 'Purchase email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Offer request
router.post('/send-offer-email', async (req, res) => {
  const { productTitle, originalPrice, offerPrice, seller, buyerName } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: seller, 
      subject: `New Offer for ${productTitle}`,
      html: `
        <h2>New Offer Received</h2>
        <p>Product: ${productTitle}</p>
        <p>Original Price: CA $${originalPrice}</p>
        <p>Offer Price: CA $${offerPrice}</p>
        <p>Buyer: ${buyerName}</p>
        <p>The buyer would like to negotiate the price.</p>
      `
    });

    res.status(200).json({ message: 'Offer email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;