import jwt from "jsonwebtoken"
const isAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"User not logged in"});
        }

        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        

        res.status(500).json({message:"Authentication failed"});
    }
}


export default isAuth