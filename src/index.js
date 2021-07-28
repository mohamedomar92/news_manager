const express = require('express');
const userRouter = require('./routers/users');
const newsRouter = require('./routers/news');

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(newsRouter);

require('./db/mongoose');

const PORT = 5000;

app.listen(PORT, () => {
  console.log('server running on port ' + PORT);
});
