import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import ProductModel, {IProduct} from '../models/productModel';
import CategoryModel, {ICategory} from '../models/categoryModel';
import cartModel, {ICart} from '../models/cartModel';
import userModel, {IUser} from '../models/userModel';
import { Express } from 'express';
import exp from 'constants';

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

const userTest: IUser = {
    userName: "John",
    email: "john@email.com",
    password: "123456",
}

beforeAll(async () => {
    app = await initApp();
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await cartModel.deleteMany()
    await userModel.deleteMany()
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
    const res3 = await request(app).post('/auth/register').send({
        userName: userTest.userName,
        email: userTest.email,
        password: userTest.password
    })
    userTest._id = res3.body._id
    expect(res3.status).toBe(201)
    const res4 = await request(app).post('/auth/login').send({
        email: userTest.email,
        password: userTest.password
    })
    userTest.tokens = []
    userTest.tokens.push(res4.body.accessToken)
    expect(res4.status).toBe(200)
    expect(userTest.tokens).toHaveLength(1)
})

afterAll(async () => {
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await cartModel.deleteMany()
    await userModel.deleteMany()
    await mongoose.connection.close()
})

let _id: string = ""

describe('Cart tests', () => {
    test('Create cart', async () => {
        if(userTest.tokens === undefined) {
            throw new Error('User not logged in')
        }
        const res = await request(app).post('/carts').set({
            Authorization: `JWT ${userTest.tokens[0]}`
        }).send({
            adminId: userTest._id,
            cartName: "Cart 1"
        });
        expect(res.status).toBe(201)
        expect(res.body.users).toHaveLength(1)
        _id = res.body._id
    })

    test('Create cart without token', async () => {
        const res = await request(app).post('/carts').send({
            adminId: userTest._id,
            cartName: "Cart 2"
        });
        expect(res.status).not.toBe(200)
    })

    test('Create cart with invalid token', async () => {
        if(userTest.tokens === undefined) {
            throw new Error('User not logged in')
        }
        const res = await request(app).post('/carts').set({
            Authorization: `JWT ${userTest.tokens[0]}1`
        }).send({
            adminId: userTest._id,
            cartName: "Cart 3"
        });
        expect(res.status).not.toBe(200)
    })

    test('Create cart with invalid adminId', async () => {
        if(userTest.tokens === undefined) {
            throw new Error('User not logged in')
        }
        const res = await request(app).post('/carts').set({
            Authorization: `JWT ${userTest.tokens[0]}`
        }).send({
            adminId: userTest._id + "1",
            cartName: "Cart 4"
        });
        expect(res.status).not.toBe(200)
    })

    test('Add product to cart', async () => {
        if(userTest.tokens === undefined) {
            throw new Error('User not logged in')
        }
        const res = await request(app).post(`/carts/addProduct/${_id}`).set({
            Authorization: `JWT ${userTest.tokens[0]}`
        }).send({
            userId: userTest._id,
            productId: productTest._id,
            productName: productTest.name,
            producPrice: productTest.price
        });
        expect(res.status).toBe(201)
        expect(res.body.productsIds).toHaveLength(1)

        const res2 = await request(app).post(`/carts/addProduct/${_id}`).set({
            Authorization: `JWT ${userTest.tokens[0]}`
        }).send({
            userId: userTest._id,
            productId: productTest._id,
            productName: productTest.name,
            producPrice: productTest.price
        });
        expect(res2.status).toBe(200)
        expect(res2.body.productsIds).toHaveLength(1)
    })
})