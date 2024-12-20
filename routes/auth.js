const express = require('express');
const jwt = require('jsonwebtoken'); //generate token
const bcrypt = require('bcryptjs');
const router = express.Router();
const users = require('../module/users');

// create account
router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new users({ username, password: hashedPassword });
      newUser.save()
  
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (e) {
      console.log(e.message);
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