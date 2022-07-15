const express = require("express");
const { dbConnection } = require("./config/config");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());

dbConnection();

app.use("/users",require("./routes/users"));

app.listen(PORT, console.log(`Servidor levantado por puerto ${PORT}`));