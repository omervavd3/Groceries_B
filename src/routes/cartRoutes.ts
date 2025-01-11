import cartController from "../controllers/cartController";
import express from 'express';
const cartRouter = express.Router();

cartRouter
    .get('/', cartController.getAll.bind(cartController))
    .post('/', cartController.create.bind(cartController))
    .get('/:id', cartController.getById.bind(cartController))
    .put('/:id', cartController.update.bind(cartController))
    .delete('/:id', cartController.adminMiddleware.bind(cartController),cartController.deleteItem.bind(cartController))
    .post('/addProduct/:id', cartController.userMiddleware.bind(cartController),cartController.addProduct.bind(cartController))
    .post('/removeProduct/:id', cartController.userMiddleware.bind(cartController),cartController.removeProduct.bind(cartController))
    .put('/clearCart/:id', cartController.userMiddleware.bind(cartController),cartController.clearCart.bind(cartController))
    .post('/addUser/:id', cartController.adminMiddleware.bind(cartController),cartController.addUser.bind(cartController))
    .post('/removeUser/:id', cartController.adminMiddleware.bind(cartController),cartController.removeUser.bind(cartController))

export default cartRouter;