import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import ProductModel, {IProduct} from '../models/productModel';
import CategoryModel, {ICategory} from '../models/categoryModel';
import cartModel, {ICart} from '../models/cartModel';
import { Express } from 'express';

var app: Express;

const categoryTest: ICategory = {
    name: "Fruits"
}

const productTest: IProduct = {
    name: "Apple",
    description: "This is an apple",
    price: 5,
    imageUrl: "https://www.google.com",
    category: categoryTest
}

const productTest2: IProduct = {
    name: "Banana",
    description: "This is a banana",
    price: 3,
    imageUrl: "https://www.google.com",
    category: categoryTest
}

const userTest = {
    name: "John",
    email: "john@email.com",
    password: "123456"
}

beforeAll(async () => {
    app = await initApp();
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await cartModel.deleteMany()
    const res = await request(app).post('/categories').send({
        name: categoryTest.name
    })
    categoryTest._id = res.body._id
    expect(res.status).toBe(201)
    const res2 = await request(app).post('/products').send({
        name: productTest.name,
        description: productTest.description,
        price: productTest.price,
        imageUrl: productTest.imageUrl,
        category: categoryTest
    })
    productTest._id = res2.body._id
    expect(res2.status).toBe(201)
})

afterAll(async () => {
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await cartModel.deleteMany()
    await mongoose.connection.close()
})

let _id: string = ""

describe('Cart tests', () => {
    test('Get carts', async () => {
        const res = await request(app).get('/carts')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(0)
    })

    test('Create cart', async () => {
        const res = await request(app).post('/carts').send({
            admin: userTest.name,
            cartName: "Cart 1"
        })
        _id = res.body._id
        expect(res.status).toBe(201)
    })

    test('Add product to cart', async () => {
        const res = await request(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest._id,
            productName: productTest.name,
            price: productTest.price
        })
        expect(res.status).toBe(201)
        expect(res.body.productsIds.length).toBe(1)
        expect(res.body.productsAmounts.length).toBe(1)
        expect(res.body.productsPrices.length).toBe(1)

        const res2 = await request(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest._id,
            productName: productTest.name,
            price: productTest.price
        })
        expect(res2.body.productsIds.length).toBe(1)
        expect(res2.body.productsAmounts.length).toBe(1)
        expect(res2.body.productsPrices.length).toBe(1)

        const res3 = await request(app).post(`/carts/addProduct/${_id}`).send({
            productId: productTest2._id,
            productName: productTest2.name,
            price: productTest2.price
        })
        expect(res3.body.productsIds.length).toBe(2)
        expect(res3.body.productsAmounts.length).toBe(2)
        expect(res3.body.productsPrices.length).toBe(2)
    })

    test('Add product to cart with wrong id, fail', async () => {
        const res = await request(app).post(`/carts/addProduct/${_id} + 1`).send({
            productId: productTest._id,
            productName: productTest.name,
            price: productTest.price
        })
        expect(res.status).not.toBe(201)
    })

    test('Update cart', async () => {
        const res = await request(app).put(`/carts/${_id}`).send({
            cartName: "Cart 2"
        })
        expect(res.status).toBe(200)
        expect(res.body.cartName).toBe("Cart 2")
    })

    test('Update cart with wrong id, fail', async () => {
        const res = await request(app).put(`/carts/${_id} + 1`).send({
            cartName: "Cart 2"
        })
        expect(res.status).not.toBe(200)
    })

    test('Remove product from cart', async () => {
        const res = await request(app).post(`/carts/removeProduct/${_id}`).send({
            productId: productTest._id
        })
        expect(res.status).toBe(200)
        expect(res.body.productsIds.length).toBe(1)
        expect(res.body.productsAmounts.length).toBe(1)
        expect(res.body.productsPrices.length).toBe(1)
    })

    test('Remove product from cart with wrong id, fail', async () => {
        const res = await request(app).post(`/carts/removeProduct/${_id} + 1`).send({
            productId: productTest._id
        })
        expect(res.status).not.toBe(200)
    })

    test('Clear cart', async () => {
        const res = await request(app).put(`/carts/clearCart/${_id}`)
        expect(res.status).toBe(200)
        expect(res.body.productsIds.length).toBe(0)
        expect(res.body.productsAmounts.length).toBe(0)
        expect(res.body.productsPrices.length).toBe(0)
    })

    test('Clear cart with wrong id, fail', async () => {
        const res = await request(app).put(`/carts/clearCart/${_id} + 1`)
        expect(res.status).not.toBe(200)
    })
})