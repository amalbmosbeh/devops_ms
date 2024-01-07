const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const checkAuth = require("../util/check-auth");

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.send("Error: " + err);
  }
});

router.post("/post", async (req, res) => {
  try {
    // Check if the user is logged in (you need to implement the checkAuth function)
    const user = checkAuth(req);

    // Get the post body from the request body
    const { body } = req.body;

    if (body.trim() === "") {
      return res.status(400).json({ error: "Post body must not be empty" });
    }

    const newPost = new Post({
      body,
      user: user.id,
      username: user.username,
      createdAt: new Date().toISOString(),
    });

    const post = await newPost.save();

    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
