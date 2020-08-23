const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const Task = require("./task");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: {
            type: Number,
            validate: value => {
                if (value < 0) {
                    throw new Error("Age must be positive");
                }
            },
            default: 30
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw "Wrong Email";
                }
            }
        },
        password: {
            type: String,
            require: true,
            minlength: 7,
            validate: value => {
                if (value.toLowerCase().includes("password")) {
                    throw "Bad Password";
                }
            }
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        avatar: {
            type: Buffer
        }
    },
    {
        timestamps: true
    }
);

// userSchema.methods.getPublicProfile = function () {
//     const user = this;
//     const userObj = user.toObject();
//     delete userObj.tokens;
//     delete userObj.password;
//     return userObj;
// };

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.tokens;
    delete userObj.password;
    delete userObj.avatar;
    return userObj;
};

// Instance function for each user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user.id }, "iamstuding");
    //Tokens stored to db
    user.tokens = [...user.tokens, { token }];
    await user.save();
    return token;
};

// Static function for whole class
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return user;
        }
        throw "Password Wrong";
    }
    throw "User not found";
};

// We cannot user arrow function here, because user=this
// Arrow function binds to outside this

// Middleware fired before save
// Some mongodb methods bypass mongoose like FindbyIdAndUpdate
// https://stackoverflow.com/questions/56844933/why-does-findbyidandupdate-bypasses-mongoose-middleware

// Virtual property not stores in db but has a
// ref from User to have easy access
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        // Hash incoming password
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Remove tasks when user is removed
userSchema.pre("remove", async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
