const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], // Référence aux utilisateurs ayant aimé le post
  likesCount: { type: Number, default: 0 },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }, // Référence à l'utilisateur ayant commenté
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

const Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;
