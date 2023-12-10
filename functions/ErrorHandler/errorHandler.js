const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ errorMessage: 'Something went wrong!', error: err });
  };
  
  module.exports = errorHandler;
  