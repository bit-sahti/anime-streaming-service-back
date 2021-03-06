require('dotenv').config();
require('./configs/mongodb.config');

const express = require('express');
// const cors = require('cors');

const apiRoutes = require('./routes/api.routes');

const app = express();

// app.use(cors( { origin: process.env.FRONT_URL } ));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRoutes);

module.exports = app;