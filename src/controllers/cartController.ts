import cartModel, { ICart } from "../models/cartModel";
import BaseController from "./baseController";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class cartController extends BaseController<ICart> {
  constructor() {
    super(cartModel, "name");
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const { cartName } = req.body;
    try {
      const data = await cartModel.findByIdAndUpdate(
        { _id: id },
        { cartName },
        { new: true }
      );
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: "Data not found" });
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async create(req: Request, res: Response) {
    const { adminId, cartName } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashAdmin = await bcrypt.hash(adminId, salt);
      const data = new cartModel({
        admin: hashAdmin,
        productsIds: [],
        productsNames: [],
        productsAmounts: [],
        productsPrices: [],
        users: [],
        cartName,
      });
      data.users.push(adminId);
      await data.save();
      res.status(201).send(data);
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async addProduct(req: Request, res: Response) {
    const id = req.params.id;
    const { productId, productName, price } = req.body;
    try {
      const cart = await cartModel.findById({ _id: id });
      if (!cart) {
        res.status(404).send({ message: "Cart not found" });
      } else {
        for (let i = 0; i < cart.productsIds.length; i++) {
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
      res.status(500).send({ error });
    }
  }

  async removeProduct(req: Request, res: Response) {
    const id = req.params.id;
    const { productId } = req.body;
    try {
      const cart = await cartModel.findById({ _id: id });
      if (!cart) {
        res.status(404).send({ message: "Cart not found" });
      } else {
        for (let i = 0; i < cart.productsIds.length; i++) {
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
        res.status(404).send({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async clearCart(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const cart = await cartModel.findById({ _id: id });
      if (!cart) {
        res.status(404).send({ message: "Cart not found" });
      } else {
        cart.productsIds = [];
        cart.productsNames = [];
        cart.productsAmounts = [];
        cart.productsPrices = [];
        await cart.save();
        res.status(200).send(cart);
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async addUser(req: Request, res: Response) {
    const id = req.params.id;
    const { userId, adminPassword } = req.body;
    try {
      const cart = await cartModel.findById({ _id: id });
      if (!cart) {
        res.status(404).send({ message: "Cart not found" });
      } else {
        const userInCart = await cart.users.find((user) =>
          bcrypt.compare(userId, user._id)
        );
        if (userInCart) {
          res.status(400).send({ message: "User already in cart" });
          return;
        }
        const salt = await bcrypt.genSalt(10);
        const userHash = await bcrypt.hash(userId, salt);
        cart.users.push(userHash);
        await cart.save();
        res.status(200).send(cart);
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async removeUser(req: Request, res: Response) {
    const id = req.params.id;
    const { userId } = req.body;
    try {
      const cart = await cartModel.findById({ _id: id });
      if (!cart) {
        res.status(404).send({ message: "Cart not found" });
      } else {
        const userInCart = await cart.users.find((user) =>
          bcrypt.compare(userId, user._id)
        );
        if (!userInCart) {
          res.status(400).send({ message: "User not in cart" });
          return;
        }
        cart.users.splice(cart.users.indexOf(userInCart), 1);
        await cart.save();
        res.status(200).send(cart);
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  async adminMiddleware(req: Request, res: Response, next: any) {
    const adminId = req.body.adminId;
    const cartId = req.params.id;
    if (!adminId) {
      res.status(400).send({ message: "No admin id" });
      return;
    }
    const cart = await cartModel.findById({ _id: cartId });
    if (!cart) {
      res.status(404).send({ message: "Cart not found" });
      return;
    }
    const validId = await bcrypt.compare(adminId, req.body.admin);
    if (!validId) {
      res.status(400).send({ message: "Invalid admin id" });
      return;
    }
    next();
  }

  async userMiddleware(req: Request, res: Response, next: any) {
    const userId = req.body.userId;
    const cartId = req.params.id;
    if (!userId) {
      res.status(400).send({ message: "No user id" });
      return;
    }
    const cart = await cartModel.findById({ _id: cartId });
    if (!cart) {
      res.status(404).send({ message: "Cart not found" });
      return;
    }
    const userInCart = await cart.users.find((user) =>
      bcrypt.compare(userId, user._id)
    );
    if (!userInCart) {
      res.status(400).send({ message: "User not in cart" });
      return;
    }
    next();
  }
}

export default new cartController();
