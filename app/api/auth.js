import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const {
  token: { secret, expiresIn },
} = config;

export const auth = expressjwt({
  secret,
  algorithms: ['HS256'],
});

export const signToken = (data) => {
  return jwt.sign(data, secret, { expiresIn });
};
