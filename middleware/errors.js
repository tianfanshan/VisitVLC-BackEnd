const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => {
    if (errors.length > 1) {
      let chain = "";
      for (let i = 0; i < errors.length; i++) {
        chain += errors[i] + "||";
      }
      const string = chain.slice(0, -4);
      res.status(400).send({ messages: string });
    } else {
      res.status(400).send({ messages: errors });
    }
  });
};

const TypeError = (err, req, res, next) => {
  const errOrigin = err.origin;
  if (err.name === "ValidationError") {
    return (err = handleValidationError(err, res));
  } else if (err.code === 11000) {
    res
      .status(400)
      .send(`The field ${Object.keys(err.keyPattern)} has to be unique`);
  } else if (errOrigin === undefined) {
    res.status(500).send("An error of unknown origin has occurred");
  } else {
    res.status(500).send(`There was a problem creating a ${errOrigin}`);
  }
};

module.exports = { TypeError };
