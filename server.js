const express = require('express');
const path = require('path');
const fs = require('fs'); 
const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const usersFilePath = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  console.log('Creating data directory...');
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(usersFilePath)) {
  console.log('Creating users.json file...');
  fs.writeFileSync(usersFilePath, '{}');
}

app.get('/', (req, res) => {
    try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    // add the new name and his/her score
    user[user.username] = {username : user.username, password: user.password};
    
    console.log('Saving updated user data...');
    fs.writeFileSync(usersFilePath, JSON.stringify(leadboard, null, 2));
    console.log('User data saved successfully');
    
    res.redirect('/');
  } catch (error) {
    console.error('Error reading users file:', error);
    res.status(500).send('Error loading user data');
  }
});
})

app.get('/edit', (req, res) => {
  try {
    const leadboard = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    // find the correct key to change
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

app.get('/edit', (req, res) => {
  try {
    const leadboard = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    // find the correct key to change
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

// Deleting an entry from the leaderboard
app.get('/delete', (req, res) => {
  try {
    const leadboard = JSON.parse(fs.readFileSync(usersFilePath));
    let user = req.query;
    // find the correct key to change
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

// Start HTTP Server on a port number 3000
// This will create a web service for your own project
const port = 3000;
app.listen(port, () => console.log(`App listening to port ${port}`));
