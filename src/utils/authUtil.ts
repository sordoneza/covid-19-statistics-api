import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

const ACCCESS_TOKEN_EXPIRES_IN = 10 * 60; // 10 min
export const createAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCCESS_TOKEN_EXPIRES_IN,
  });
};

export const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days
export const createRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
};

export const decodeToken = (token: string) => {
  return jwtDecode(token);
};
