import createHttpError from 'http-errors';
import { Sessions } from '../db/models/session.js';
import { Users } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const { authHeader } = req.headers;

  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be type of Bearer'));
  }

  const session = await Sessions.findOne({ accessToken: token });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
  }

  const user = await Users.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'Session not found'));
  }

  req.user = user;

  next();
};
