const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const handleErrors = require("./utils/errors");
const {
  NOT_FOUND_ERROR
} = require("./utils/constants");

// подключаемся к серверу mongo
mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// теперь клиент имеет доступ только к публичным файлам
app.use(express.static(path.join(__dirname, 'public')));

//middleware для обработки данных в формате JSON
app.use(express.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

//middleware временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: "645e72d9f5df792a6c98e5dc",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

// Middleware для обработки несуществующих путей
app.use((req, res, next) => {
  res.status(404).sendFile('404.html', { root: './public' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});