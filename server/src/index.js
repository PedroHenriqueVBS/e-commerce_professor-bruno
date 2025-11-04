const express = require('express');
const cors = require('cors');
const promotionsRouter = require('./routes/promotions');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/promotions', promotionsRouter);
app.use('/users', usersRouter);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
