import { foodModel } from "../models/foodModels.js";
import fs from 'fs';


//add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })
    try {
        await food.save();
        res.json({ success: true, message: "food Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }

}

// all food list to show on browser from the backend store
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//remove food item

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id); // this line is used to find the model of that id 
        fs.unlink(`uploads/${food.image_filename}`, () => { }) //this line delete the image from the folder

        await foodModel.findByIdAndDelete(req.body.id); // this line delete the data from db.
        res.json({ success: true, message: "food removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addFood, listFood,removeFood};