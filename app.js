const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);


// Load Routes
const auth = require('./routes/auth');


const app = express();

// Set Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



// Load Keys
const keys = require('./config/keys');

// Connect to Mongo
mongoose.connect(keys.MongoURI, {useNewUrlParser: true})
    .then(() => console.log(`MongoDB Connected...`))
    .catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('It works');
});


// cookieParser
app.use(cookieParser());
// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on port ${port}`));