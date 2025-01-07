import express, { Express } from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
import productRouter from './routes/productRoutes';
import categoryRouter from './routes/categoryRoutes';
import cartRouter from './routes/cartRoutes';
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/carts', cartRouter);

//mongoose connection
import mongoose from 'mongoose';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/groceries';
const initApp = async () => {
    return new Promise<Express>((resolve, reject) => {
        if(!MONGO_URL) {
            reject('Mongo URL is required')
        } else {
            mongoose
                .connect(MONGO_URL)
                .then(() => {
                    console.log('Connected to MongoDB');
                    resolve(app);
                })
                .catch((error) => {
                    console.error({error});
                    reject('Error connecting to MongoDB');
                });
        }
    })
}

export default initApp;