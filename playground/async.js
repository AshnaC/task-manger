const doSomething = async num => {
    return num + 9;
};

const printStuff = async () => {
    const num1 = await doSomething(4);
    console.log("numb", num1);
    const num2 = await doSomething(5);
    console.log("numb", num2);
    throw new Error();
    return num2;
};

// printStuff();

const add = async (a, b) => {
    const sum = await (a + b);
    return sum;
};

module.exports = add;
