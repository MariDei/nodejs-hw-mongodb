import { Users } from '../db/models/user.js';

export const registerUser = async (payload) => {
  return await Users.create(payload);
};
