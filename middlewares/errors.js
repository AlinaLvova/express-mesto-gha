const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

module.exports = (error, req, res, next) => {
  if (error.statusCode === 500) {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
  } else {
    res.status(error.statusCode).send({ message: error.message });
  }
  next();
};
