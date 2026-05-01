const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not set. Using hardcoded admin credentials only.');
}

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Hardcoded admin credentials (always works)
// username: admin, password: 12345 (hashed for reference)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$10$E9rnJsqaA8DZsN4LMx6.l.h4hKqN5Rf9qN6G5KL5kR6R5kN5Rf9qN'; // hash of '12345'

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check against hardcoded admin user first
    if (username === ADMIN_USERNAME) {
      // Compare with hardcoded admin password
      const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (isMatch) {
        return res.redirect('/welcome');
      } else {
        return res.redirect('/?error=invalid');
      }
    }

    // Check MongoDB for other users
    if (MONGODB_URI) {
      const user = await User.findOne({ username });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.redirect('/welcome');
        }
      }
    }

    // Invalid credentials
    res.redirect('/?error=invalid');
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/?error=server');
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
