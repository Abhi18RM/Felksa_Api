import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/product.js";

const app = express();
dotenv.config();

app.use(express.json());

//Listing all the porducts
app.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Creating a product
app.post("/create", async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Updating a product
app.put("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.updateOne({ $set: req.body });
            res.status(200).json("product details has been updated");
        } else {
            res.status(404).json("product not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Deleting a product
app.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.status(200).json("Product deleted successfully");
        }
        else {
            res.status(404).json("Product not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server is running and connected to the database`));


    })
    .catch((err) => console.log(`${err} did not connect`));