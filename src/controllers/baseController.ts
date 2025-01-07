import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
    model: Model<T>;
    filter: any;
    constructor(model: any, filter: any) {
        this.model = model;
        this.filter = filter;
    }

    async getAll(req: Request, res: Response) {
        const filter = req.query.filter;
        try {
            if(filter) {
                const data = await this.model.find({ [this.filter]: filter });
                res.status(200).send(data);
            } else {
                const data = await this.model.find();
                res.status(200).send(data);
            }
        } catch (error) {
            res.status(500).send({ error });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data = new this.model(req.body);
            await data.save();
            res.status(201).send(data);
        } catch (error) {
            res.status(500).send({ error });
        }
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const data = await this.model.findById({ _id: id });
            if(data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({ message: "Data not found" });
            }
        } catch (error) {
            res.status(500).send({ error });
        }
    }

    async deleteItem(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const data = await this.model.findByIdAndDelete({ _id: id });
            if(data) {
                res.status(200).send({ message: "Data deleted" });
            } else {
                res.status(404).send({ message: "Data not found" });
            }
        } catch (error) {
            res.status(500).send({ error });
        }
    }
}

export default BaseController;