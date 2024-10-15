import express from "express";
import dotenv from "dotenv";
import productRoutes from './routes/products.js';
import paymentRoutes from './routes/payment.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
import cookieParser from "cookie-parser";
import { connectDataBase } from "./config/dbConnect.js";
import errorMiddleWare from './middlewares/errors.js';
import bodyParser from "body-parser";
import { fileURLToPath } from 'node:url';


import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({path: "backend/config/config.env"});
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/webhook/stripe', bodyParser.raw({ type: 'application/json' }));



//Handle Uncaught Exceptions
process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err}`);
    console.log("Shutting down server due to uncaught exception");
    process.exit(1);
})

//database connection added
connectDataBase();

app.use(express.json({
    limit : "10mb",
    verify: (req,res,buf) => {
        req.rawBody = buf.toString();
    }
}))

app.use(express.json({limit: "10mb"}));
app.use(cookieParser());

//Import all routes

app.use('/api/v1',productRoutes);
app.use('/api/v1',authRoutes);
app.use('/api/v1',orderRoutes);
app.use('/api/v1',paymentRoutes);


if(process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.use("*", (req,res)=>{
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
}

//Using error middleware
app.use(errorMiddleWare);

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORT: ${process.env.PORT}`);
});

//handle Unhandled promise rejections
process.on("unhandledRejection", (err)=>{
    console.log(`Error : ${err}`);
    console.log("Shutting down server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    })
})