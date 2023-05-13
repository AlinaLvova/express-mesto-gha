const INTERNAL_SERVER_ERROR = require('./constants'); // Default error.

// Функция для обработки ошибок
const handleErrors = (err, res) => {
  res.status(INTERNAL_SERVER_ERROR).send({ message: `Ошибка по умолчанию.` });
};

module.exports = {
  handleErrors
};