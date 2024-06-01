import mongoose from "mongoose";

export const connectDB = async ()=> {
    await mongoose.connect('mongodb+srv://alok:alok12345@cluster0.tuk3q2v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=> console.log("DB Connected"))
}
// mongodb+srv://alok:alok12345@cluster0.tuk3q2v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0