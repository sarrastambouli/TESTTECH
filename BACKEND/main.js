const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const otherUsersRoutes = require('./routes/otherUsersRoutes'); 
const postRoute = require('./routes/postroute');// Importez la route
const commentRoute = require('./routes/commentroute'); // Importez la route des commentaires
const likeRoute = require('./routes/likeroute'); 
const postInfoRoutes = require('./routes/postinforoute');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/BACKEND/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filePath);
});

// Connect to database
mongoose.connect('mongodb://localhost/TESTIEG', { useNewUrlParser: true, useUnifiedTopology: true });
console.log("connected to database");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store all files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Define the user schema
const accountSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: Date,
  gender: String,
  password: String,
  profilePhoto: String
});

// Create the model
const Account = mongoose.model('Account', accountSchema, 'accounts');

async function getAccountByEmail(email) {
  console.log(`Getting account by email: ${email}`);
  const query = { email: email };
  const account = await Account.findOne(query).exec();
  console.log(`Account found: ${JSON.stringify(account)}`);
  return account;
}

async function comparePassword(email, providedPassword) {
  const account = await getAccountByEmail(email);
  return account ? await bcrypt.compare(providedPassword, account.password) : null;
}

app.post('/api/v1/authenticate', async (req, res) => {
  const { email, password } = req.body;
  console.log('Authentication request received for email:', email);

  try {
    const account = await getAccountByEmail(email);

    if (!account) {
      console.log('No account found for email:', email);
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const isValidPassword = await comparePassword(email, password);
    console.log('Password :', password);
    console.log('Password is valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for email:', email);
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    // Return success response
    res.json({ authenticated: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route pour obtenir un utilisateur par email
app.get('/api/v1/users', async (req, res) => {
  const email = req.query.email; // Utilisez req.query pour les paramètres de requête
  
  console.log(`Received email query: ${email}`); // Affiche l'email reçu dans la console
  
  try {
    const account = await Account.findOne({ email: email }).exec();
    if (account) {
      res.json(account);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (err) {
    console.error(`Error fetching user: ${err}`);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/api/v1/check-email/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const account = await Account.findOne({ email: email }).exec();
    if (account) {
      res.send({ exists: true });
    } else {
      res.send({ exists: false });
    }
  } catch (err) {
    console.error(`Error checking email: ${err}`);
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route pour gérer l'inscription des utilisateurs
app.post('/api/v1/accounts', upload.single('profilePhoto'), async (req, res) => {
  const { name, email, date, gender, password } = req.body;
  try {
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash le mot de passe
      const newAccount = new Account({
        name,
        email,
        dateOfBirth: new Date(date),
        gender,
        password: hashedPassword,
        profilePhoto: req.file ? req.file.path : null // Stocke le chemin du fichier téléchargé
      });
      await newAccount.save();
      res.send({ message: 'User created successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating user' });
  }
});

// Utilisez les routes pour other-users
app.use('/api/v1', otherUsersRoutes);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/comment', commentRoute); // Ajoutez la route des commentaires
app.use('/api/v1/like', likeRoute);
app.use('/api/v1/postinfo', postInfoRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
