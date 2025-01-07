import cartModel, {ICart} from "../models/cartModel";
import BaseController from "./baseController";
import { Request, Response } from "express";

class cartController extends BaseController<ICart> {
    constructor() {
        super(cartModel, "name");
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const { cartName} = req.body;
        try {
            const data = await cartModel.findByIdAndUpdate({_id: id}, {cartName}, {new: true});
            if(data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({message: "Data not found"});
            }
        } catch (error) {
            res.status(500).send({error});
        }
    }

    async create(req: Request, res: Response) {
        const {admin, cartName} = req.body;
        try {
            const data = new cartModel({admin, productsIds: [],productsNames: [], productsAmounts: [], productsPrices: [], users: [], cartName});
            await data.save();
            res.status(201).send(data);
        } catch (error) {
            res.status(500).send({ error });
        }
    }

    async addProduct(req: Request, res: Response) {
        const id = req.params.id;
        const {productId,productName, price} = req.body;
        try {
            const cart = await cartModel.findById({_id: id});
            if(!cart) {
                res.status(404).send({message: "Cart not found"});
            } else {
                for (let i=0; i < cart.productsIds.length; i++) {
                    if (cart.productsIds[i] === productId) {
                        cart.productsAmounts[i] += 1;
                        cart.productsPrices[i] += price;
                        await cart.save();
                        res.status(200).send(cart);
                        return;
                    }
                }
                cart.productsIds.push(productId);
                cart.productsNames.push(productName);
                cart.productsAmounts.push(1);
                cart.productsPrices.push(price);
                await cart.save();
                res.status(201).send(cart);
            }
        } catch (error) {
            res.status(500).send({error});
        }
    }

    async removeProduct(req: Request, res: Response) {
        const id = req.params.id;
        const {productId} = req.body;
        try {
            const cart = await cartModel.findById({_id: id});
            if(!cart) {
                res.status(404).send({message: "Cart not found"});
            } else {
                for (let i=0; i < cart.productsIds.length; i++) {
                    if (cart.productsIds[i] === productId) {
                        cart.productsIds.splice(i, 1);
                        cart.productsNames.splice(i, 1);
                        cart.productsAmounts.splice(i, 1);
                        cart.productsPrices.splice(i, 1);
                        await cart.save();
                        res.status(200).send(cart);
                        return;
                    }
                }
                res.status(404).send({message: "Product not found"});
            }
        } catch (error) {
            res.status(500).send({error});
        }
    }
    
    async clearCart(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const cart = await cartModel.findById({_id: id});
            if(!cart) {
                res.status(404).send({message: "Cart not found"});
            } else {
                cart.productsIds = [];
                cart.productsNames = [];
                cart.productsAmounts = [];
                cart.productsPrices = [];
                await cart.save();
                res.status(200).send(cart);
            }
        } catch (error) {
            res.status(500).send({error});
        }
    }
}

export default new cartController();