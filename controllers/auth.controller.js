import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

const signUp = async(req, res) =>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser  = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = await genToken(user._id);
        res.cookie("token", token,{
            httpOnly: true,
            maxAge: 15*24*60*60*1000,
            sameSite:"lax",
            secure: false
        })
        res.status(200).json({user, message: "User created successfully"});

        
    } catch (error) {
        res.status(500).json({message:"Something went wrong while signing up"});
    }
}


const Login = async(req, res) =>{
    try {
        const { email, password} = req.body;
        if( !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user  = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exists"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"});
        }


        const token = await genToken(user._id);
        res.cookie("token", token,{
            httpOnly: true,
            maxAge: 15*24*60*60*1000,
            sameSite:"lax",
            secure: false
        })
       res.status(200).json({user, message: "User logged in successfully"});

        
    } catch (error) {
        res.status(500).json({message:"Something went wrong while logging in"});
    }
}

const logout = async(req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({message:"User logged out successfully"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong while logging out"});
    }
}









export {signUp, Login,logout}


