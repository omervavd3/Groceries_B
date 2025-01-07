import cartController from "../controllers/cartController";
import express from 'express';
const cartRouter = express.Router();

cartRouter
    .get('/', cartController.getAll.bind(cartController))
    .post('/', cartController.create.bind(cartController))
    .get('/:id', cartController.getById.bind(cartController))
    .put('/:id', cartController.update.bind(cartController))
    .delete('/:id', cartController.deleteItem.bind(cartController))
    .post('/addProduct/:id', cartController.addProduct.bind(cartController))
    .post('/removeProduct/:id', cartController.removeProduct.bind(cartController))
    .put('/clearCart/:id', cartController.clearCart.bind(cartController))

export default cartRouter;