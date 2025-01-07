import { Request, Response } from "express";
import productModel, {IProduct} from "../models/productModel";
import BaseController from "./baseController";

class ProductController extends BaseController<IProduct> {
    constructor() {
        super(productModel, "category");
    }


    async update(req: Request, res: Response) {
        const id = req.params.id;
        const {name, price, description, imageUrl, category} = req.body;
        try {
            const data = await this.model.findByIdAndUpdate({_id: id}, {name, price, description, imageUrl, category}, {new: true});
            if(data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({message: "Data not found"});
            }
        } catch (error) {
            res.status(500).send({error});
        }
    }
}

export default new ProductController();