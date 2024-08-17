import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Users } from '../db/models/user.js';

export const registerUser = async (payload) => {
  const user = await Users.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await Users.create({
    ...payload,
    password: encryptedPassword,
  });
};
