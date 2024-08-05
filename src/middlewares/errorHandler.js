import { isHttpError } from 'http-errors';
// eslint-disable-next-line no-unused-vars
export async function errorHandler(error, req, res, next) {
  if (isHttpError(error) === true) {
    return res.status(error.status).send({
      status: error.status,
      message: error.message,
      data: error,
    });
  }

  console.error(error);

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
}
