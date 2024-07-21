// controllers/otherUsersController.js
const Account = require('../schemas/account'); // Assurez-vous que le chemin est correct

// Contrôleur pour obtenir tous les autres utilisateurs
async function getOtherUsers(req, res) {
    try {
      const users = await Account.find({}, 'name profilePhoto').exec(); // Ne sélectionne que 'name' et 'profilePhoto'
      console.log('Other users fetched:', users); // Affiche les autres utilisateurs dans la console
      res.json(users);
    } catch (err) {
      console.error('Error fetching other users:', err);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
  
  module.exports = { getOtherUsers };