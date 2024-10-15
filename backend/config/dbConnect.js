import mongoose, { Mongoose } from "mongoose";

export const connectDataBase = () => {
    mongoose.connect(process.env.DB_URI).then((con) => {
        console.log(`MongoDb database connected with Host : ${con?.connection?.host}`);
    })
}