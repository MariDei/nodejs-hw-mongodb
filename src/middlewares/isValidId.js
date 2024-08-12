import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId =
  (contactId = 'id') =>
  (req, res, next) => {
    const id = req.params[contactId];

    if (!id) {
      throw createHttpError(400, `Id parameter ${contactId} is required`);
    }
    if (!isValidObjectId(id)) {
      return next(createHttpError(400, 'Invalid Id format'));
    }
    return next();
  };
