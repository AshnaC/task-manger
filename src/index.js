const express = require("express");
// Mongoose connected
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();

const port = process.env.PORT || 3000;

//Automatically parse incoming json data from request
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("App listening to port " + port);
});

// res.send() is calling JSON.stringify in the background
// toJSON() is called whenever the object is getting stingified
