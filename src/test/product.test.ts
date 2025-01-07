//test for products
import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import ProductModel, {IProduct} from '../models/productModel';
import CategoryModel, {ICategory} from '../models/categoryModel';
import express, { Express } from 'express';


let app: Express;

const categoryTest: ICategory = {
    name: "Fruits"
}


beforeAll(async () => {
    app = await initApp();
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    const res = await request(app).post('/categories').send(categoryTest)
    categoryTest._id = res.body._id
    expect(res.status).toBe(201)
})

const productTest: IProduct = {
    name: "Apple",
    description: "This is an apple",
    price: 5,
    imageUrl: "https://www.google.com",
    category: categoryTest._id
}

afterAll(async () => {
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await mongoose.connection.close()
})

describe('Product tests', () => {
    test('Get products', async () => {
        const res = await request(app).get('/products')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(0)
    })

    test('Create product', async () => {
        const res = await request(app).post('/products').send({
            name: productTest.name,
            description: productTest.description,
            price: productTest.price,
            imageUrl: productTest.imageUrl,
            category: productTest.category
        })
        expect(res.status).toBe(201)
        expect(res.body.name).toBe(productTest.name)
    })
})