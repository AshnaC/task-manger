require("../src/db/mongoose");

const User = require("../src/models/user");

const updateUser = async (id, name) => {
    const user = await User.findByIdAndUpdate(id, {
        name
    });
    const count = await User.countDocuments({ name: "Anil" });
    return { user, count };
};

const Task = require("../src/models/task");

const deleteTask = async id => {
    await Task.findByIdAndDelete(id);
    const count = Task.countDocuments({ completed: false });
    return count;
};

const doStuff = async () => {
    const res1 = await updateUser("5f1d29cfabfd87b953d89b52", "Anil");
    const res2 = await deleteTask("5f1d28329fbc0ba621fd6806");
    console.log(res1, res2);
};

doStuff().catch(err => {
    console.log(err);
});
