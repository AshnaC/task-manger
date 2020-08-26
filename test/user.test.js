const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
    name: "Taylor",
    email: "tay@gmail.com",
    password: "12345678"
};
let id;
let token;

beforeEach(async () => {
    await User.deleteMany();
    const userObj = await new User(userOne).save();
    id = userObj._id;
    token = await userObj.generateAuthToken(userOne.email, userOne.password);
    // console.log(token);
});

test("Sign up a new user", async () => {
    const response = await request(app)
        .post("/user")
        .send({
            name: "Brandy",
            email: "bran@gmail.com",
            password: "12345678"
        })
        .expect(201);
    // console.log(response.body.result._id);
    const user = await User.findById(response.body.result._id);
    expect(user).not.toBeNull();
    expect(response.body).toMatchObject({
        result: {
            name: "Brandy",
            email: "bran@gmail.com"
        }
    });
});

test("Should Login existing user", async () => {
    const response = await request(app).post("/users/login").send(userOne).expect(200);
    const user = await User.findById(response.body.user._id);
    expect(user.tokens[1].token).toBe(response.body.token);
});

test("Should not login bad user", async () => {
    await request(app)
        .post("/users/login")
        .send({ ...userOne, password: "34" })
        .expect(400);
});

test("Get profile for user", async () => {
    await request(app).get("/users/me").set("Authorization", `Bearer ${token}`).send().expect(200);
});

test("Do not get profile for bad user", async () => {
    await request(app).get("/users/me").send().expect(400);
});

test("Should delete Account for user", async () => {
    const response = await request(app)
        .delete("/user")
        .set("Authorization", `Bearer ${token}`)
        .send()
        .expect(200);
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test("Should not delete Account for bad user", async () => {
    await request(app).delete("/user").send().expect(400);
});

test("Avatar image is solved", async () => {
    await request(app)
        .post("/user/avatar")
        .set("Authorization", `Bearer ${token}`)
        .attach("avatar", "test/fixtures/sample.png")
        .expect(200);
    const user = await User.findById(id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Upload User Name", async () => {
    const response = await request(app)
        .patch("/user")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Quote" })
        .expect(200);
    expect(response.body.name).toBe("Quote");
});
