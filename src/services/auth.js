import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { randomBytes } from 'crypto';
import { Users } from '../db/models/user.js';
import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { Sessions } from '../db/models/session.js';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });
  if (user !== null) {
    throw createHttpError(409, 'Email in use');
  }
  payload.password = await bcrypt.hash(payload.password, 10);

  return Users.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await Users.findOne({ email });
  if (user === null) throw createHttpError(404, 'User not found');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  await Sessions.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return Sessions.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Sessions.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired)
    throw createHttpError(401, 'Session token expired');

  await Sessions.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return await Sessions.create({
    userId: session.userId,
    ...newSession,
  });
};
export const logoutUser = async (sessionId) => {
  await Sessions.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(SMTP.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env(SMTP.APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let entries;
  try {
    entries = jwt.verify(token, env(SMTP.JWT_SECRET));
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
      throw createHttpError(401, 'Token is expired or invalid');
    throw err;
  }
  const user = await Users.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  await Promise.all([
    Users.updateOne({ _id: user._id }, { password: encryptedPassword }),
    Sessions.deleteOne({ userId: user._id }),
  ]);
};
