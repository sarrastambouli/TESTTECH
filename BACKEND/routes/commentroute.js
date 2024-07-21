const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment'); // Assurez-vous que ce modèle est correctement défini

// Route pour ajouter un commentaire
router.post('/', async (req, res) => {
    const { postId, userId, content } = req.body;
    try {
      const newComment = new Comment({ postId, userId, content });
      await newComment.save();
      res.status(201).send(newComment);
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).send({ error: 'Error adding comment' });
    }
  });
  
  module.exports = router;