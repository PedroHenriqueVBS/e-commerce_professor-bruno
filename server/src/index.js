const express = require("express");
const cors = require("cors");
const connectMongo = require("./config/mongo");

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const promotionsRouter = require("./routes/promotions");
const authRouter = require("./routes/auth");

const app = express();

// conectar ao mongo
connectMongo();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// rotas
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/promotions", promotionsRouter);

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
