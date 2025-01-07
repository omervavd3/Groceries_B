//router for product routes
import ProductController from '../controllers/productController';
import express from 'express';
const productRouter = express.Router();

productRouter
    .get('/', ProductController.getAll.bind(ProductController))
    .post('/', ProductController.create.bind(ProductController))
    .get('/:id', ProductController.getById.bind(ProductController))
    .put('/:id', ProductController.update.bind(ProductController))
    .delete('/:id', ProductController.deleteItem.bind(ProductController))

export default productRouter;