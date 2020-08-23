// Middleware - Called before api call hits route
// So we can customise our incoming request

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, "iamstuding");
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token
        });
        if (user) {
            req.token = token;
            req.user = user;
            next();
            return;
        }
        throw new Error();
    } catch (e) {
        res.status(400).send("Authentication failed");
    }
};

module.exports = auth;
