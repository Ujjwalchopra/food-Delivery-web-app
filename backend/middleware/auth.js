import jwt from 'jsonwebtoken';

// middleware function to authorize the token for adding items in cart
const authMiddleware= async (req,res,next) => {
    const {token} = req.headers; // destructuring the token from request header
    if(!token){
        return res.json({success: false,message: "Not Authorized Login Again"})
    }
    try {
        //verifying the token
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decode.id; //using this userid we add,remove,get the items in cart for particular user
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message: "Error"});
    }
}

export default authMiddleware;