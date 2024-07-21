const express = require('express');
const router = express.Router();
const Post = require('../schemas/posts');
const Comment = require('../schemas/comment');
const Like = require('../schemas/like');

// Route pour récupérer tous les posts avec leurs commentaires, likes et utilisateur
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('createdBy', 'name profilePhoto') // Populate user details
      .exec();

    // Ajouter des informations sur les likes et le nombre de commentaires
    const postsWithDetails = await Promise.all(posts.map(async (post) => {
      const comments = await Comment.find({ postId: post._id }).exec();
      const likesCount = await Like.countDocuments({ postId: post._id }).exec();
      return {
        ...post.toObject(),
        comments,
        likesCount
      };
    }));

    res.json(postsWithDetails);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route pour récupérer un post spécifique avec ses commentaires, likes et utilisateur
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate('userId', 'name profilePhoto') // Populate user details
      .exec();

    if (post) {
      const comments = await Comment.find({ postId: post._id }).exec();
      const likesCount = await Like.countDocuments({ postId: post._id }).exec();
      res.json({
        ...post.toObject(),
        comments,
        likesCount
      });
    } else {
      res.status(404).send({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
