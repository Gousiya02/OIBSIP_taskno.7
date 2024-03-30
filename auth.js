const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/models');

const app = express.Router();


app.get('/register', (req, res) => {
  res.render('register');
});


app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, password: hashedPassword });
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'USERNAME ALREADY EXISTS');
    res.redirect('/register');
  }
});


app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }

  req.session.userId = user._id;
  res.redirect('/home');
});


function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    req.flash('error', 'You need to be logged in to access this page');
    res.redirect('/login');
  }
}

app.get('/home', isAuthenticated, (req, res) => {
  res.render('home');
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});



module.exports = app;
