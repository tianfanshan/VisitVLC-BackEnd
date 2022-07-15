const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URI, MONGO_URI_TEST, DB_TEST } = process.env;

const dbConnection = async () => {
  try {
    if (DB_TEST == "true") {
      await mongoose.connect(MONGO_URI_TEST);
      console.log("Te has conectado a la base de datos de testing");
    } else {
      await mongoose.connect(MONGO_URI);
      console.log("Te has conectado a la base de datos del deploy");
    }
    console.log("Base de datos conectada con éxito!");
  } catch (error) {
    console.error(error);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = {
  dbConnection,
};
