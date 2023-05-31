const jwt = require('jsonwebtoken');

const config = require('../config');
const UNAUTHORIZED_ERROR = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startWidth('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR).send({
      message: 'Необходима авторизация',
    });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecretKey);
  } catch (err) {
    const error = new Error('Необходима авторизация');
    error.statusCode = UNAUTHORIZED_ERROR;

    next(error);
  }

  req.user = payload;

  return next();
};
