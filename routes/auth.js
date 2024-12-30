const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const users = require('../module/users');
const nodemailer = require('nodemailer');
const validator = require('validator');

router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // email form
      if (!validator.isEmail(email)) {
        console.log(email)
        return res.status(400).json({ message: "Invalid email format" });
      }

      // email exist or not
      users.findOne({email})
        .then(async(user)=>{
          if (user) {
            return res.status(400).json({ message: "Email already registered" });
          }
          // create new user
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new users({ 
            username, 
            email,
            password: hashedPassword,
            verified: true  
          });
    
          await newUser.save();
          res.status(201).json({ message: "Account created successfully" });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Server error" });
        });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: "Server error" });
    }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email },
      "abc", // Replace with a secure secret key
      { expiresIn: "1h" }
    );

    // Send the token and username in the response
    res.json({
      message: "Logged in successfully",
      token,
      user: {
        username: user.username, // Include the username
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;