const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("../token");

const User = mongoose.model("User");

router.post("/signup", async (req, res) => {
  const { login, password } = req.body;
  const user = new User({
    login,
    password_hash: bcrypt.hashSync(password, 10),
  });
  try {
    await user.save();
    const token = sign({ userId: user._id });
    return res.send({ token });
  } catch (err) {
    // if(err.message.startWith('E11000'))
    res.status(400).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });
  if (!user) {
    return res.status(422).send({ message: "User does not exist" });
  }
  if (bcrypt.compareSync(password, user.password_hash)) {
    const token = sign({ userId: user._id });
    return res.send({ token });
  }
  res.status(401).send({ message: "Password is incorrect" });
});

module.exports = router;
