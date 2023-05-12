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

//middleware для обработки данных в формате JSON
app.use(express.json());

//middleware временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '645e72d9f5df792a6c98e5dc'
  };

  next();
});


// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true,
  // useFindAndModify: false
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
