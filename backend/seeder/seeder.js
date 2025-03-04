import mongoose from "mongoose"
import Product from "../models/product.js";
import products from "./data.js";

const seedProducts = async() => {
    try {
        await mongoose.connect("mongodb+srv://sumitkumar11200007:Sumit123@cluster0.0rmavvl.mongodb.net/shopit-v2?retryWrites=true&w=majority");

        await Product.deleteMany();
        console.log("Products are deleted");

        await Product.insertMany(products);
        console.log("Products are added");

        process.exit();
    } catch(error){
        console.log(error.message);
        process.exit();
    }
};

seedProducts();