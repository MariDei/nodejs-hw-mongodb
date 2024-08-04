// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  res.json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};
