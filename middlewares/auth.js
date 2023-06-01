const jwt = require('jsonwebtoken');

const config = require('../utils/config');
const { UNAUTHORIZED_ERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwtToken;
  let payload;

  try {
    payload = jwt.verify(token, config.jwtSecretKey);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }
};
