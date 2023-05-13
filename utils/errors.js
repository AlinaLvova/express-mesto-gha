const BAD_REQUEST_ERROR = 400; // Invalid data provided for creating a card, user, updating user avatar or profile.
const NOT_FOUND_ERROR = 404; // Card or user not found.
const INTERNAL_SERVER_ERROR = 500; // Default error.

// Функция для обработки ошибок
const handleErrors = (err, res) => {
  res.status(INTERNAL_SERVER_ERROR).send({ message: `Ошибка по умолчанию.` });
};

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  handleErrors
};