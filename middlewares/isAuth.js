

import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"User not logged in"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        req.userId = decoded.userId || decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({message:"Invalid or expired token"});
    }
}

export default isAuth;




