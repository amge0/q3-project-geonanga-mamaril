const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Route to render a page (make sure views/index.hbs exists)
app.get('/some-page', (req, res) => {
  res.render('index'); // not index.html
});

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

// Main route - Add user
app.get('/', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    users[user.username] = {
      username: user.username,
      password: user.password
    };

    console.log('Saving updated user data...');
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log('User data saved successfully');

    res.redirect('/');
  } catch (error) {
    console.error('Error reading users file:', error);
    res.status(500).send('Error loading user data');
  }
});

// Edit user scores
app.get('/edit', (req, res) => {
  try {
    const leadboard = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    for (let key in user) {
      leadboard[key].score = Number(user[key]);
    }

    console.log('Saving updated user data...');
    fs.writeFileSync(usersFilePath, JSON.stringify(leadboard, null, 2));
    console.log('User data saved successfully');

    res.redirect('/');
  } catch (error) {
    console.error('Error reading users file:', error);
    res.status(500).send('Error loading user data');
  }
});

// Delete user
app.get('/delete', (req, res) => {
  try {
    const leadboard = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    for (let key in user) {
      delete leadboard[key];
    }

    console.log('Saving updated user data...');
    fs.writeFileSync(usersFilePath, JSON.stringify(leadboard, null, 2));
    console.log('User data saved successfully');

    res.redirect('/');
  } catch (error) {
    console.error('Error reading users file:', error);
    res.status(500).send('Error loading user data');
  }
});

// Start server
const port = 3000;
app.listen(port, () => console.log(`App listening to port ${port}`));
