const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: { // информация о пользователе
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: { // ссылка на аватарку
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный e-mail',
    },
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
}, {
  versionKey: false, // Отключение опции versionKey
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.toJSON = () => {
  const data = this.toObject();
  return data;
};

module.exports = mongoose.model('user', userSchema);
