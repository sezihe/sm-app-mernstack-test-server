const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const express = require('express');

const app = express();
require('dotenv').config();

// connecting to mongoDB
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
).then(() => console.log("DB connected!"));

mongoose.connection.on("error", err => console.log(`DB Connection Error: ${err.message}`))

// bringing in routes
const postsRoutes = require('./routes/posts');

// using middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(expressValidator());
app.use(morgan('tiny'));

// using routes
app.use('/', postsRoutes);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));