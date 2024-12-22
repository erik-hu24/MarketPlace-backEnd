const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const users = require('../module/users');
const nodemailer = require('nodemailer');
const validator = require('validator');

router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      // email form
      if (!validator.isEmail(username)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // username exist or not
      users.findOne({username})
        .then(async(user)=>{
          if (user) {
            return res.status(400).json({ message: "Email already registered" });
          }
          // create new user
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new users({ 
            username, 
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
    const { username, password } = req.body;

    users.findOne({username})
      .then(async(user)=>{
          if (!user) {
              return res.status(400).json({ message: "Invalid username or password" });
            }
        
            const passwordMatch = await bcrypt.compare(password, user.password);
        
            if (!passwordMatch) {
              return res.status(400).json({ message: "Invalid username or password" });
            }
        
            const token = jwt.sign(
              { username: user.username },
              'abc',
              {
                expiresIn: "1h",
              }
            );
        
            res.json({ message: "Logged in successfully", token });
      })
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;