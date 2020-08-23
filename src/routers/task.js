const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/task", auth, async (req, res) => {
    try {
        const user = req.user;
        const task = new Task({ ...req.body, owner: user._id });
        const result = await task.save();
        res.status(201).send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/tasks", auth, async (req, res) => {
    try {
        const { completed, limit, skip, sortBy } = req.query;
        let match = {};
        if (completed) {
            match.completed = completed === "true";
        }
        let sort = {};
        if (sortBy) {
            const [field, value] = sortBy.split("_");
            sort[field] = value == "desc" ? -1 : 1;
        }
        // Populate tasks ref from user
        // await req.user.populate("tasks").execPopulate();
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    sort
                }
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.get("/allTasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

// router.get("/task/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const task = await Task.findById(id);
//         res.status(200).send(task);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

router.get("/task/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        if (task) {
            res.status(200).send(task);
        }
        res.status(404).send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch("/task/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const newObj = req.body;
        let task = await Task.findOne({ _id: id, owner: req.user._id });
        if (task) {
            Object.keys(newObj).forEach(elt => (task[elt] = newObj[elt]));
            const updated = await task.save();
            return res.status(200).send(updated);
        }
        return res.status(404).send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete("/task/:id", auth, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        if (task) {
            await task.remove();
            return res.status(200).send(task);
        }
        return res.status(404).send("No task found");
    } catch (e) {
        return res.status(500).send(e);
    }
});

module.exports = router;
