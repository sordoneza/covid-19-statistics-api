import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/User";

export const requireAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let token = req.headers["authorization"];
  token = token && token.split(" ")[1]; //Access token

  // Validate if token is present
  if (!token) return res.status(403).json({ error: "User not authenticated" });

  try {
    // Verify accessToken
    const decodedToken = <any>(
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
    );
    const { userId } = decodedToken;

    // Verifiy User is still connected
    const user = await User.findOne({ _id: userId }).lean();

    if (!user || !user.connected)
      return res.status(403).json({ error: "User not authenticated" });

    res.locals.userId = userId;
    next();
  } catch (err: any) {
    // Validate error type
    if (err.message === "jwt expired")
      return res.status(403).json({
        error: "Access token expired",
      });

    return res.status(403).json({ error: "Invalid Token" });
  }
};
