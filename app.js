const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

// Слушаем 3000 порт
const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true,
  // useFindAndModify: false
});