import { Request, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
  const { email, password, userName } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(400).send({ message: "User already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ email, password: hashPassword, userName });
    await newUser.save();
    res.status(201).send({ newUser });
  } catch (error) {
    res.status(500).send({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(400).send({ message: "Invalid password" });
      return;
    }
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const jwtExpiresIn = process.env.jwt_EXPIRES_IN;
    if (!refreshTokenSecret || !accessTokenSecret || !jwtExpiresIn) {
      res.status(500).send({ message: "No secret token" });
      return;
    }
    const mathRandom = Math.random().toString();
    const accessToken = await jwt.sign(
      {
        _id: user._id,
        random: mathRandom,
      },
      accessTokenSecret,
      { expiresIn: jwtExpiresIn }
    );
    const refreshToken = await jwt.sign(
      {
        _id: user._id,
        random: mathRandom,
      },
      refreshTokenSecret,
      { expiresIn: jwtExpiresIn }
    );
    if (user.tokens == null) {
      user.tokens = [];
    }
    user.tokens.push(refreshToken);
    await user.save();
    res
      .status(200)
      .send({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.status(500).send({ error });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers["authorization"];
    const refreshToken = authToken && authToken.split(" ")[1];
    if (refreshToken == null) {
      res.status(401).send("Unauthorized");
      return;
    }
    if (process.env.REFRESH_TOKEN_SECRET == null) {
      res.status(500).send("Internal server error");
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err: jwt.VerifyErrors | null, payload: any) => {
        if (err) {
          res.status(403).send("Error");
          return;
        }
        const user = await userModel.findById((payload as payload)._id);
        if (user == null) {
          res.status(403).send("User is null");
          return;
        }
        if (!user.tokens.includes(refreshToken)) {
          user.tokens = [];
          await user.save();
          res.status(403).send("No matching token");
          return;
        }
        user.tokens = user.tokens.filter((token) => token !== refreshToken);
        await user.save();
        res.status(200).send("Logged out");
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

type payload = {
  _id: string;
};

const refresh = async (req: Request, res: Response) => {
  const authToken = req.headers["authorization"];
  const refreshToken = authToken && authToken.split(" ")[1];
  if (refreshToken == null) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    if (process.env.REFRESH_TOKEN_SECRET == null) {
      res.status(500).send("Internal server error");
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err: jwt.VerifyErrors | null, payload: any) => {
        if (err) {
          res.status(403).send("Wrong refresh token");
          return;
        }
        const user = await userModel.findById((payload as payload)._id);
        if (user == null) {
          res.status(403).send("Forbidden");
          return;
        }
        if (user.tokens == null) {
          res.status(403).send("Forbidden");
          return;
        }
        if (!user.tokens.includes(refreshToken)) {
          user.tokens = [];
          await user.save();
          res.status(403).send("Forbidden");
          return;
        }
        if (
          process.env.ACCESS_TOKEN_SECRET == null ||
          process.env.JWT_EXPIRES_IN == null ||
          process.env.REFRESH_TOKEN_SECRET == null
        ) {
          res.status(500).send("Internal server error");
          return;
        }
        const random = Math.random().toString();
        const accesToken = await jwt.sign(
          {
            _id: user._id,
            random: random,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        const newRefreshToken = await jwt.sign(
          {
            _id: user._id,
            random: random,
          },
          process.env.REFRESH_TOKEN_SECRET
        );
        user.tokens.push(newRefreshToken);
        await user.save();
        res
          .status(200)
          .send({ accessToken: accesToken, refreshToken: newRefreshToken });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

const autMiddleware = async (req: Request, res: Response, next: any) => {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token == null) {
    res.status(401).send("No token provided");
    return;
  }

  if (process.env.ACCESS_TOKEN_SECRET == null) {
    res.status(500).send("No token secret");
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      res.status(403).send("Error in middleware");
      return;
    }
    req.params.userId = (payload as payload)._id;
    next();
  });
};

export default { register, login, logout, refresh, autMiddleware };
