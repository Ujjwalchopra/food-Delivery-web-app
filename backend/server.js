import express from "express";
import cors from  "cors"
import {connectDB} from "./config/db.js"
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config.js' //for env support 
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app= express();
const port= 4000;

//middleware
app.use(express.json());
app.use(cors()); // so that we can access backend from forntend

//db connection
connectDB();

//api endpoints

app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);


app.get('/',(req,res)=> {
   res.send("Api Working");
})

app.listen(port,()=> {
    console.log(`Server started on http://localhost:${port}`)
})

//mongodb+srv://<username>:<password>@cluster0.2hk7wzy.mongodb.net/?