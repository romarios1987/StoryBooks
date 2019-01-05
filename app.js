const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);


// Load Routes
const auth = require('./routes/auth');



const app = express();


// Load Keys
const keys = require('./config/keys');

// Connect to Mongo
mongoose.connect(keys.MongoURI, {useNewUrlParser: true})
    .then(() => console.log(`MongoDB Connected...`))
    .catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('It works');
});


// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on port ${port}`));