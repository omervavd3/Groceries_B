import request from 'supertest';
import initApp from '../server';
import mongoose from 'mongoose';
import ProductModel, {IProduct} from '../models/productModel';
import CategoryModel, {ICategory} from '../models/categoryModel';
import { Express } from 'express';

var app: Express;

beforeAll(async () => {
    app = await initApp();
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
})

afterAll(async () => {
    await ProductModel.deleteMany()
    await CategoryModel.deleteMany()
    await mongoose.connection.close()
})

let _id: string = ""

describe('Category tests', () => {
    test('Get categories', async () => {
        const res = await request(app).get('/categories')
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(0)
    })

    test('Create category', async () => {
        const res = await request(app).post('/categories').send({
            name: "Fruits"
        })
        expect(res.status).toBe(201)
        expect(res.body.name).toBe("Fruits")
        _id = res.body._id

        const res2 = await request(app).get('/categories')
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(1)
    })

    test('Create category with existing name', async () => {
        const res = await request(app).post('/categories').send({
            name: "Fruits"
        })
        expect(res.status).not.toBe(201)
    })

    test('Get category by id', async () => {
        const res = await request(app).get(`/categories/${_id}`)
        expect(res.status).toBe(200)
        expect(res.body.name).toBe("Fruits")
    })

    test('Get category by invalid id', async () => {
        const res = await request(app).get(`/categories/123`)
        expect(res.status).not.toBe(200)
    })

    test('Update category', async () => {
        const res = await request(app).put(`/categories/${_id}`).send({
            name: "Vegetables"
        })
        expect(res.status).toBe(200)
        expect(res.body.name).toBe("Vegetables")
    })

    test('Update category with false id', async () => {
        const res = await request(app).put(`/categories/123`).send({
            name: "Vegetables"
        })
        expect(res.status).not.toBe(200)
    })

    test('Get category by filter', async () => {
        const res = await request(app).get(`/categories?filter=Vegetables`)
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)

        const res2 = await request(app).get(`/categories?filter=Fruits`)
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(0)
    })

    test('Delete category', async () => {
        const res = await request(app).delete(`/categories/${_id}`)
        expect(res.status).toBe(200)

        const res2 = await request(app).get(`/categories`)
        expect(res2.status).toBe(200)
        expect(res2.body.length).toBe(0)
    })
})