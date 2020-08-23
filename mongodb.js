const mongodb = require("mongodb");
const { MongoClient, ObjectID } = mongodb;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manger";

const id = new ObjectID();
console.log("id", id, id.getTimestamp());

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log("Connection failed");
    }
    //Reference to the DB
    const db = client.db(databaseName);
    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");

    // Insert One
    // Insert Many

    // usersCollection.findOne({ name: "Ashna" }, (error, user) => {
    //     if (error) {
    //         return console.log("Unable to fetch");
    //     }
    //     console.log("user", user);
    // });
    // usersCollection.findOne({ _id: new ObjectID("5f18587c8bb4f3946d58b3d2") }, (error, user) => {
    //     if (error) {
    //         return console.log("Unable to fetch");
    //     }
    //     console.log("user", user);
    // });

    // Find Return cursor
    // usersCollection.find({ age: 27 }).toArray((error, user) => {
    //     if (error) {
    //         return console.log("Unable to fetch");
    //     }
    //     console.log("user", user);
    // });

    // tasksCollection.findOne({ _id: new ObjectID("5f1856af88a1447e7e60e974") }, (error, task) => {
    //     console.log("task", task);
    // });

    // tasksCollection.find({ completed: false }).toArray((error, tasks) => {
    //     console.log("tasks", tasks);
    // });

    // usersCollection
    //     .updateOne({ _id: new ObjectID("5f18533b63f6d252879e2980") }, { $set: { name: "Ashna Updated" } })
    //     .then(result => {
    //         console.log("result", result);
    //     })
    //     .catch(err => {});
    // usersCollection
    //     .updateOne({ _id: new ObjectID("5f18533b63f6d252879e2980") }, { $inc: { age: 1 } })
    //     .then(result => {
    //         console.log("result", result);
    //     })
    //     .catch(err => {});

    // tasksCollection
    //     .updateMany(
    //         { completed: false },
    //         {
    //             $set: {
    //                 completed: true
    //             }
    //         }
    //     )
    //     .then(result => {
    //         console.log("result", result);
    //     })
    //     .catch(err => {});

    // usersCollection
    //     .deleteMany({ age: 27 })
    //     .then(result => {
    //         console.log("result", result.deletedCount:);
    //     })
    //     .catch(err => {});

    // tasksCollection.deleteOne
});
