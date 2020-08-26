const add = require("../playground/async");

test("Hello World", done => {
    setTimeout(() => {
        expect(2).toBe(2);
        done();
    }, 1000);
});

test("Async Add", async () => {
    const sum = await add(1, 2);
    expect(sum).toBe(3);
});
