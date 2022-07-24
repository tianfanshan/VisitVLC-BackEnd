const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  if (errors.length) {
    let chain = "Por favor introduzca su ";
    for (let i = 0; i < errors.length; i++) {
      chain += errors[i] + " , ";
    }
    const string = chain.slice(0, -4);
    res.status(400).send({ messages: string });
  } else {
    res.status(400).send({ messages: errors });
  }
};

const TypeError = (err, req, res, next) => {
  const errOrigin = err.origin;
  if (err.name === "ValidationError") {
    return (err = handleValidationError(err, res));
  } else if (err.code === 11000) {
    res.status(400).send(`El ${Object.keys(err.keyPattern)} tiene que ser unico`);
  } else if (errOrigin === undefined) {
    res.status(500).send("Se ha producido un error de origen desconocido");
  } else {
    res.status(500).send(`Hubo un problema al crear ${errOrigin}`);
  }
};

module.exports = { TypeError };
