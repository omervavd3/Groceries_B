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
    category: categoryTest
}

afterAll(async () => {
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await mongoose.connection.close()
})

let _id: string = ""

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
        _id = res.body._id
        expect(res.status).toBe(201)
        expect(res.body.name).toBe(productTest.name)

        const res2 = await request(app).get('/products')
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(1)
    })

    test('Create same product, fail', async () => {
        const res = await request(app).post('/products').send({
            name: productTest.name,
            description: productTest.description,
            price: productTest.price,
            imageUrl: productTest.imageUrl,
            category: productTest.category
        })
        expect(res.status).not.toBe(201)
    })

    test('Get product by id', async () => {
        const res = await request(app).get(`/products/${_id}`)
        expect(res.status).toBe(200)
        expect(res.body.name).toBe(productTest.name)
    })

    test('Get product by id, fail', async () => {
        const res = await request(app).get(`/products/${_id} + 1`)
        expect(res.status).not.toBe(200)
    })

    test('Get products by category', async () => {
        const res = await request(app).get(`/products?filter=${categoryTest._id}`)
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
    })

    test('Update product', async () => {
        const res = await request(app).put(`/products/${_id}`).send({
            name: "Banana",
            description: "This is a banana",
            price: 3,
            imageUrl: "https://www.google.com",
            category: categoryTest
        })
        expect(res.status).toBe(200)
        expect(res.body.name).toBe("Banana")
    })

    test('Update product, fail', async () => {
        const res = await request(app).put(`/products/${_id} + 1`).send({
            name: "Banana",
            description: "This is a banana",
            price: 3,
            imageUrl: "https://www.google.com",
            category: categoryTest
        })
        expect(res.status).not.toBe(200)
    })

    test('Delete product', async () => {
        const res = await request(app).delete(`/products/${_id}`)
        expect(res.status).toBe(200)

        const res2 = await request(app).get('/products')
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(0)
    })

    test('Update product fail', async () => {
        const res = await request(app).put(`/products/${_id}`).send({
            name: "Banana",
            description: "This is a banana",
            price: 3,
            imageUrl: "https://www.google.com",
            category: categoryTest
        })
        expect(res.status).not.toBe(200)
    })

    test('Delete product, fail', async () => {
        const res = await request(app).delete(`/products/${_id}`)
        expect(res.status).not.toBe(200)
    })

    test('Delete product, fail 500', async () => {
        const res = await request(app).delete(`/products/${_id} + 1`)
        expect(res.status).not.toBe(200)
    })
})