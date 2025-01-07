import express from 'express';
import CategoryController from '../controllers/categoryController';
const categoryRouter = express.Router();

categoryRouter
    .get('/', CategoryController.getAll.bind(CategoryController))
    .post('/', CategoryController.create.bind(CategoryController))
    .get('/:id', CategoryController.getById.bind(CategoryController))
    .put('/:id', CategoryController.update.bind(CategoryController))
    .delete('/:id', CategoryController.deleteItem.bind(CategoryController))

export default categoryRouter;