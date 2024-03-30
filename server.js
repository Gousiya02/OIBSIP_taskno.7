const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const mongoDbStore = MongoStore.create({
  mongoUrl: 'mongodb://localhost/authentication'
});

mongoose.connect('mongodb://localhost:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;


app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  store: mongoDbStore
})
)

app.set('view engine', 'ejs');

app.use(express.static(path.join('public')));

app.use(flash());

app.use('/', require('./routes/auth'));





const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
