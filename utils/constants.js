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

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  SUCCESS_STATUS,
  CREATED_STATUS,
};
