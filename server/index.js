const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const tagsRouter = require('./routes/tags');
const placesRouter = require('./routes/places');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Логування запитів
app.use((req, res, next) => {
  console.log(`Запит: ${req.method} ${req.url}`);
  next();
});

app.use('/api/routes', routes);
app.use('/api/tags', tagsRouter);
app.use('/api/places', placesRouter);

// Обробка помилок
app.use(errorHandler);

app.listen(PORT, 'localhost', () => {
  console.log(`Server started on http://localhost:${PORT}`);
});