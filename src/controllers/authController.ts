import express from 'express';
import User from '../models/User';
import {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  REFRESH_TOKEN_EXPIRES_IN,
  verifyRefreshToken,
} from '../utils/authUtil';

// controller actions
export const signup_post = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  try {
    //Check if user already exist for requested email
    const userAlreadyExist = await User.findOne({ email }).lean();

    if (userAlreadyExist) return res.status(403).json({ error: 'User already exist' });

    // Persist User Object
    const user = await User.create({ email, password });

    // Generate accessToken for User
    const accessToken = createAccessToken(user._id);

    // Decode Access Token to include expiration to response
    const decodedToken = <any>decodeToken(accessToken);
    const expiresAt = decodedToken.exp;

    // Generate refreshToken
    const refreshToken = createRefreshToken(user._id);

    // Build UserInfo Object for response
    const userInfo = {
      userId: user._id,
      email,
    };

    // Set RefreshToken Cookie
    res
      .status(201)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
      })
      .json({
        message: 'User created!',
        accessToken,
        userInfo,
        expiresAt,
      });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const login_post = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  try {
    // Call static method login from User Model to validate user values
    const user = await User.login(email, password);

    // Build UserInfo Object from retrieved user
    const userInfo = { userId: user._id, email: user.email };

    // Generate accessToken for User
    const accessToken = createAccessToken(user._id);

    // Decode Access Token to include expiration to response
    const decodedToken = <any>decodeToken(accessToken);
    const expiresAt = decodedToken.exp;

    // Generate refreshToken
    const refreshToken = createRefreshToken(user._id);

    res
      .status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
      })
      .json({
        message: 'Authentication successful!',
        accessToken,
        userInfo,
        expiresAt,
      });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const refreshToken_get = async (req: express.Request, res: express.Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(403).json({ error: 'User not authenticated' });

  // verify refresh token is valid
  try {
    const { userId } = <any>verifyRefreshToken(refreshToken);

    //Get User from DB using refreshToken data
    const user = await User.findOne({ _id: userId }).lean();

    // Build UserInfo Object from retrieved user
    const userInfo = { userId: user._id, email: user.email };

    //Create new access token
    const accessToken = createAccessToken(userId);

    // Decode Access Token to include expiration to response
    const decodedToken = <any>decodeToken(accessToken);
    const expiresAt = decodedToken.exp;

    res.status(200).json({
      message: 'Refresh Token successful!',
      accessToken,
      userInfo,
      expiresAt,
    });
  } catch (err) {
    // Validate error type
    if (err.message === 'jwt expired')
      return res.status(403).json({
        error: 'Refresh token expired',
      });

    return res.status(403).json({ error: 'Invalid Token' });
  }
};

export const logout_get = async (req: express.Request, res: express.Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(403).json({ error: 'User not authenticated' });

  try {
    // verify refresh token is valid
    const { userId } = <any>verifyRefreshToken(refreshToken);

    // Marks user as not connected
    await (<any>User.logout(userId));

    // Delete refreshToken cookie
    res.cookie('refreshToken', '', { maxAge: 0 }).sendStatus(200);
  } catch (err) {
    // Validate error type
    if (err.message === 'jwt expired')
      return res.status(403).json({
        error: 'Refresh token expired',
      });

    return res.status(403).json({ error: 'Invalid Token' });
  }
};
