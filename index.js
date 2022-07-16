const express = require("express");
const cors = require('cors');
const app = express();

const { dbConnection } = require("./config/config");
const { TypeError } = require("./middleware/errors");

require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())

dbConnection();

app.use("/users", require("./routes/users"));

app.use(TypeError);

app.listen(PORT, console.log(`Servidor levantado por puerto ${PORT}`));