const handleMongooseError = (error, data, next) => {
  error.status = 400;
  console.lor(error);
  next();
};

module.exports = handleMongooseError;
