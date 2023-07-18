const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./errorHandler');
const NotFoundError = require('./errors/not-found-err');
const { createUser, login } = require('./controllers/users');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const CONNECTION_STRING = 'mongodb://localhost:27017/mestodb';

const app = express();

mongoose.connect(CONNECTION_STRING);

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), createUser);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
