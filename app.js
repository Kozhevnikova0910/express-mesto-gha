const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./errorHandler');
const NotFoundError = require('./errors/not-found-err');
const { createUser, login } = require('./controllers/users');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/;
const CONNECTION_STRING = 'mongodb://localhost:27017/mestodb';

const app = express();

mongoose.connect(CONNECTION_STRING);

app.use(express.json());

app.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login);
app.use('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(reg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), createUser);

// app.use(require('./middlewares/auth'));

app.use('/users', require('./middlewares/auth'), require('./routes/users'));
app.use('/cards', require('./middlewares/auth'), require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
