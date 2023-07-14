const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./errorHandler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b0312cc2dd0c1ac14b32f7',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorHandler);

app.listen(PORT, () => {});
