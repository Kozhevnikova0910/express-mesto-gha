const BAD_REQUEST = 400;
const NOT_FOUND_CODE = 404;
const COMMON_ERROR_CODE = 500;

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(BAD_REQUEST).send({ message: err.message });
  }
  if (err.name === 'NotFoundError') {
    res.status(NOT_FOUND_CODE).send({ message: err.message });
  }
  if (err.name === 'ValidationError') {
    res.status(BAD_REQUEST).send({ message: err.message });
  } else {
    res.status(COMMON_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
  next();
};

module.exports = errorHandler;
