const jwt = require('jsonwebtoken');
const User = require("../model/UserModel");

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session out",
            logout: true
        };
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password"); 
        return user ? user : null; 
    } catch (error) {
        return null; 
    }
};




module.exports = {getUserDetailsFromToken};