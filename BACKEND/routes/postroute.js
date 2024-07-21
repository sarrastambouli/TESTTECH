// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../schemas/posts');

router.post('/', async (req, res) => {
  const post = new Post({
    content: req.body.content,
    createdBy: req.body.createdBy,
    createdAt: new Date()
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;