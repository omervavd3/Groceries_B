import cartController from "../controllers/cartController";
import authController from "../controllers/authController";
import express from 'express';
const cartRouter = express.Router();

cartRouter
    .get('/', cartController.getAll.bind(cartController))
    .post('/', authController.autMiddleware.bind(authController),cartController.create.bind(cartController))
    .get('/:id', cartController.getById.bind(cartController))
    .put('/:id', cartController.update.bind(cartController))
    .delete('/:id', authController.autMiddleware.bind(authController), cartController.adminMiddleware.bind(cartController),cartController.delete.bind(cartController))
    .post('/addProduct/:id', authController.autMiddleware.bind(authController) ,cartController.userMiddleware.bind(cartController),cartController.addProduct.bind(cartController))
    .post('/removeProduct/:id', authController.autMiddleware.bind(authController) ,cartController.userMiddleware.bind(cartController),cartController.removeProduct.bind(cartController))
    .put('/clearCart/:id', authController.autMiddleware.bind(authController) ,cartController.userMiddleware.bind(cartController),cartController.clearCart.bind(cartController))
    .post('/addUser/:id', authController.autMiddleware.bind(authController) ,cartController.adminMiddleware.bind(cartController),cartController.addUser.bind(cartController))
    .post('/removeUser/:id', authController.autMiddleware.bind(authController) ,cartController.adminMiddleware.bind(cartController),cartController.removeUser.bind(cartController))

export default cartRouter;