const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handleErrors = require('./utils/errors');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true,
  // useFindAndModify: false
});

// Слушаем 3000 порт
const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

//middleware для обработки данных в формате JSON
app.use(express.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})

//middleware временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '645e72d9f5df792a6c98e5dc2'
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

