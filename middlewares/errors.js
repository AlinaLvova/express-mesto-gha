const { isCelebrateError } = require("celebrate");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST_ERROR } = fixrequire("../utils/constants");
module.exports = (error, req, res, next) => {
  if (isCelebrateError(error)) {
    return res.status(BAD_REQUEST_ERROR).send('Ошибка валидации.');
  };
  if (error.statusCode === 500) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка по умолчанию." });
  } else {
    res.status(error.statusCode).send({ message: error.message });
  }
  next();
};
