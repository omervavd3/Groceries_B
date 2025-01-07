import categoryModel, {ICategory} from "../models/categoryModel";
import BaseController from "./baseController";
import { Request, Response } from "express";


class categoryController extends BaseController<ICategory> {
    constructor() {
        super(categoryModel, "name");
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const {name} = req.body;
        try {
            const data = await this.model.findByIdAndUpdate({_id: id}, {name}, {new: true});
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

export default new categoryController();