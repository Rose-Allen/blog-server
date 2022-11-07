const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { verify } = require("../token");

const Post = mongoose.model("Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  // console.log(req.headers.authorization);
  const token = req.headers.authorization;

  try {
    verify(token);
    // console.log(data);
    const post = new Post({
      title: req.body.title,
      body: req.body.body,
    });
    await post.save();
    res.send(post);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.patch("/:id", async (req, res) => {
  verify(token);
  const id = req.params.id;
  const updates = req.body;
  try {
    const token = req.headers.authorization;
    verify(token);
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    res.send(post);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization;
    verify(token);
    const post = await Post.findByIdAndRemove(req.params.id);
    res.send(post);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
