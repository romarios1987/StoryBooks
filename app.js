const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');


// Handlebars Helpers
const {truncate, stripTags, formatDate, select, editIcon} = require('./helpers/correct_text');


// Passport Config
require('./config/passport')(passport);


// Load Routes
const index = require('./routes/index');
const stories = require('./routes/stories');
const auth = require('./routes/auth');


const app = express();


// Use Helpers
app.locals.truncate = truncate;
app.locals.stripTags = stripTags;
app.locals.formatDate = formatDate;
app.locals.select = select;
app.locals.editIcon = editIcon;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Method override middleware
app.use(methodOverride('_method'));

// Views, Layout EJS
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

app.use(expressLayouts);


// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Load Keys
const keys = require('./config/keys');


// Connect to Mongo
mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
    .then(() => console.log(`MongoDB Connected...`))
    .catch(err => console.log(err));


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


// Set Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});
// Use Routes
app.use('/', index);
app.use('/stories', stories);
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on port ${port}`));