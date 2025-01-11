import authController from "../controllers/authController";
import express from 'express';
const authRouter = express.Router();

authRouter
    .post('/register', authController.register.bind(authController))
    .post('/login', authController.login.bind(authController))
    .post('/logout' ,authController.logout.bind(authController))
    .post('/refresh' ,authController.refresh.bind(authController))

export default authRouter;