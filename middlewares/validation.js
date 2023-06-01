const { celebrate, Joi, Segments } = require('celebrate');
const avatarUrlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;

const loginValidator = celebrate({
  [Segments.BODY]:{
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }
})

const signupValidator = celebrate({
  [Segments.BODY]:{
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(avatarUrlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }
})

const getMeValidator = celebrate({
  [Segments.BODY]:{
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }
})

module.exports = {
  loginValidator,
  signupValidator,
  getMeValidator,
  
}