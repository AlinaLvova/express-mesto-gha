// Invalid data provided for creating a card, user, updating user avatar or profile.
const BAD_REQUEST_ERROR = 400;
// Card or user not found.
const NOT_FOUND_ERROR = 404;
// Default error.
const INTERNAL_SERVER_ERROR = 500;
// Success - request processed successfully.
const SUCCESS_STATUS = 200;
// Success - new resource created.
const CREATED_STATUS = 201;
// Conflict error
const CONFLICT_ERROR = 409;
// Unauthorized
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;

const DEFAULT_NAME = 'Жак-Ив Кусто';
const DEFAULT_AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
const DEFAULT_ABOUT = 'Исследователь';

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  SUCCESS_STATUS,
  CREATED_STATUS,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
  DEFAULT_NAME,
  DEFAULT_AVATAR,
  DEFAULT_ABOUT,
  FORBIDDEN_ERROR
};
