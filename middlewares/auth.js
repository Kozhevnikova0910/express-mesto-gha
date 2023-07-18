const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  console.log(1)
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  console.log(2)
  try {
    console.log(3)
    payload = jwt.verify(token, 'not-secret-key');
    console.log(payload)
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
  }

  req.user = payload;

  next();
};