// eslint-disable-next-line no-unused-vars
export const notFoundHandler = (req, res, next) => {
  res.json({
    status: 404,
    message: 'Route not found',
  });
};
