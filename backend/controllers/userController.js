import userModel from "../models/userModels.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"; //for encrypt the password. 
import validator from "validator"

// login user
const loginUser= async (req,res) => {
  const {email,password}= req.body;
  try {

    //find the existing user in db through email.
      const user= await userModel.findOne({email});
      if(!user){
        return res.json({success: false,message: "User doesnot exists"});
      }

      //comparing the entered password with database password
      const isMatch = await bcrypt.compare(password,user.password);

      if(!isMatch){
        return res.json({success: false, message: "Invalid Password"});
      }
   
      //generating token
      const token= createToken(user._id);
      res.json({success:true,token});



  } catch (error) {
    console.log(error);
    res.json({success:false, message: "Error"})
  }
}

//create token

 const createToken= (id) => {
     return jwt.sign({id},process.env.JWT_SECRET);
 }

//register user
const registerUser = async(req,res) => {
    const {name,password,email} = req.body;
    try {
        //checking is user already exists;
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success: false,message: "user already exists"});
        }

        //validating email format and strong password
       if(!validator.isEmail(email)){
        return res.json({success: false,message: "Please enter a valid email"})
       }

       //checking password length
       if(password.length<8){
        return res.json({success:false,message: "Please enter a strong password of length more than 8"})
       }
      
       //hashing user password
       const salt= await bcrypt.genSalt(10) // here we encrypt our password of max length 10 we can encrypt this in between (5,10);
       const hashedPassword = await bcrypt.hash(password,salt); 

      //adding new user 
      const newUser= new userModel({
        name: name,
        email:email,
        password:hashedPassword
      })
      //save the user in db.
      const user= await newUser.save();
      
      //sending the token as a response to user
      const token= createToken(user._id);
      res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

export {loginUser,registerUser};