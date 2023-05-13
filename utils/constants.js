const BAD_REQUEST_ERROR = 400; // Invalid data provided for creating a card, user, updating user avatar or profile.
const NOT_FOUND_ERROR = 404; // Card or user not found.
const INTERNAL_SERVER_ERROR = 500; // Default error.
const SUCCESS_STATUS = 200; // Success - request processed successfully.
const CREATED_STATUS = 201; // Success - new resource created.

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  SUCCESS_STATUS,
  CREATED_STATUS
};