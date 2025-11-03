const express = require('express');
const cors = require('cors');
const promotionsRouter = require('./routes/promotions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/promotions', promotionsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
