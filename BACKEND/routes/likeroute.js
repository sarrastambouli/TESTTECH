const express = require('express');
const router = express.Router();
const Like = require('../schemas/like'); // Assurez-vous que ce modèle est correctement défini

// Route pour ajouter un like
router.post('/', async (req, res) => {
    const { postId, userId } = req.body;
    try {
      const existingLike = await Like.findOne({ postId, userId });
      if (existingLike) {
        return res.status(400).send({ error: 'User has already liked this post' });
      }
      const newLike = new Like({ postId, userId });
      await newLike.save();
      res.status(201).send(newLike);
    } catch (err) {
      console.error('Error adding like:', err);
      res.status(500).send({ error: 'Error adding like' });
    }
  });
  
  module.exports = router;