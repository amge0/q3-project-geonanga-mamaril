const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve index.html and static assets

// Data file setup
const usersFilePath = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  console.log('Creating data directory...');
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(usersFilePath)) {
  console.log('Creating users.json file...');
  fs.writeFileSync(usersFilePath, '{}');
}

// Home route - Add user from query and serve index.html
app.get('/', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = req.query;

    // Only save if username and password provided
    if (user.username && user.password) {
      users[user.username] = {
        username: user.username,
        password: user.password
      };

      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      console.log('User added:', user.username);
    }

    // Serve the static index.html file
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (error) {
    console.error('Error handling user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Edit user scores
app.get('/edit', (req, res) => {
  try {
    const leaderboard = JSON.parse(fs.readFileSync(usersFilePath));
    const updates = req.query;

    for (let key in updates) {
      if (leaderboard[key]) {
        leaderboard[key].score = Number(updates[key]);
      }
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(leaderboard, null, 2));
    res.redirect('/');
  } catch (error) {
    console.error('Error editing user scores:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete user
app.get('/delete', (req, res) => {
  try {
    const leaderboard = JSON.parse(fs.readFileSync(usersFilePath));
    const toDelete = req.query;

    for (let key in toDelete) {
      delete leaderboard[key];
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(leaderboard, null, 2));
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
const port = 3000;
app.listen(port, () => console.log(`Server running at http://127.0.0.1:${port}`));
