const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const COMMON_ERROR_CODE = 500;

const errorHandler = (err, req, res, next) => {
  if (err.name === "NotFoundError") {
    res.status(NOT_FOUND_CODE).send(err.message);
  }
  else {
    res.status(COMMON_ERROR_CODE).send("Неизвестная ошибка");
  }
}

module.exports = errorHandler;