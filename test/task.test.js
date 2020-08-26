const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const Task = require("../src/models/task");

const userOne = {
    name: "Jan",
    email: "jan@gmail.com",
    password: "12345678"
};
let id;
let token;
let taskId;

const taskOne = {
    desc: "Random",
    completed: false
};

beforeEach(async () => {
    await User.deleteMany();
    await Task.deleteMany();
    const userObj = await new User(userOne).save();
    id = userObj._id;
    token = await userObj.generateAuthToken(userOne.email, userOne.password);
    const taskObj = await new Task({ ...taskOne, owner: id }).save();
    taskId = taskObj._id;
    // console.log(token);
});

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/task")
        .set("Authorization", `Bearer ${token}`)
        .send({
            desc: "Random_234",
            completed: false,
            owner: id
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
});

test("Get tasks of User 1", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send();
    // console.log("here", response.body[0].desc);
    expect(response.body[0].desc).toBe("Random");
});
