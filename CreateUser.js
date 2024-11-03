const express = require("express");
const router = express.Router();
const User = require("./User");
const { body, validationResult } = require('express-validator');
const cors = require("cors");
router.use(cors());
const jwtSecret="MyNameIsAjayPandeyAndIWantToDoJobINItField$#";
const jwt= require("jsonwebtoken");
const bcrypt=require("bcryptjs");

router.post("/loginuser",
  [
    body('email', 'Incorrect Email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.status(400).json({ errors: "Try Logging in with Correct Credentials " })
      }

      const pwdCompare= await bcrypt.compare(req.body.password,userData.password)
      if (!pwdCompare) {
        return res.status(400).json({ errors: "Try Logging in with Correct Credentials " })
      }
 
       const data={
        user:{
          id:userData.id
        }
       }
      const authToken=jwt.sign(data,jwtSecret)

      return res.json({ success: true , authToken:authToken});
    } catch (error) {
      console.log(error)
      res.json({ success: false });
    }
  })

router.post("/createuser", [
  body('email', 'Incorrect Email').isEmail(),
  body('name').isLength({ min: 5 }),
  body('password', 'Incorrect Password').isLength({ min: 5 })],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const salt = await bcrypt.genSalt(10);
  let secPassword= await bcrypt.hash(req.body.password, salt)

    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location
      })
      res.json({ success: true });
    } catch (error) {
      console.log(error)
      res.json({ success: false });
    }
  })
module.exports = router;
