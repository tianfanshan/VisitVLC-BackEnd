const express = require("express");
const app = express();

const { dbConnection } = require("./config/config");
const { TypeError } = require("./middleware/errors");

require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());

dbConnection();

app.use("/users", require("./routes/users"));
app.use("/routes",require("./routes/routes"))

app.use(TypeError);

app.listen(PORT, console.log(`Servidor levantado por puerto ${PORT}`));
