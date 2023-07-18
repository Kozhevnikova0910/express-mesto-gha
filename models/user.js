const mongoose = require('mongoose');
const validator = require('validator');
const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (url) => reg.test(url),
        message: 'Неверный формат ссылки',
      }
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Неверный адрес почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неверные данные пользователя');
        err.name = 'Unauthorized';
        return Promise.reject(err);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Неверные данные пользователя');
            err.name = 'Unauthorized';
            return Promise.reject(err);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
