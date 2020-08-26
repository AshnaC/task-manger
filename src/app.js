const express = require("express");
// Mongoose connected
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

//Automatically parse incoming json data from request
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;

// res.send() is calling JSON.stringify in the background
// toJSON() is called whenever the object is getting stingified
