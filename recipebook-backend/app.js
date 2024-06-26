var express = require('express');
require('express-async-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const env = require('dotenv');
env.config();

const authRouter = require('./routes/auth');
const recipesRouter = require('./routes/recipes');
const tagsRouter = require('./routes/tags');
const cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(process.env.IMAGE_DIR));
app.use(cors({origin: [process.env.CLIENT_IP], credentials: true}));

app.use('/auth', authRouter);
app.use('/recipes', recipesRouter);
app.use('/tags', tagsRouter);
app.use((err, req, res, next) => {
    res.status(500);
    res.json({message: 'Hiba a feldolgozás során'});
    console.log(err);
});

module.exports = app;
