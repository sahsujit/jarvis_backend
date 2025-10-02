
import jwt from "jsonwebtoken";

const genToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        return null;
    }
};

export default genToken;
