const express = require('express');
const { getOtherUsers } = require('../controllers/otherUsersController'); // Assurez-vous que ce chemin est correct
const router = express.Router();

// Route pour obtenir tous les autres utilisateurs
router.get('/other-users', getOtherUsers);

module.exports = router;
