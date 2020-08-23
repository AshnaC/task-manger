const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");

const Email = require("../email");
const email = new Email();

const User = require("../models/user");
const sharp = require("sharp");

router.post("/user", async (req, res) => {
    try {
        const user = User(req.body);
        const result = await user.save();
        email.sendMail(user.email, user.name, true);
        const token = await user.generateAuthToken(user.email, user.password);
        res.status(201).send({ result, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/users/me", auth, async (req, res) => {
    const user = req.user; //.getPublicProfile(); - Handled by toJSON
    res.send(user);
});

// Calls auth middleware before hitting the next call back
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

// router.get("/user/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const user = await User.findById(id);
//         if (user) {
//             res.send(user);
//         } else {
//             res.status(400).send("No user found");
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(500).send(e);
//     }
// });

// router.patch("/user/:id", async (req, res) => {
//     try {
//         const newObj = req.body;
//         const allowedFields = ["age", "name", "email", "password"];
//         const incomingFields = Object.keys(newObj);
//         const isValid = incomingFields.every(elt =>
//             allowedFields.includes(elt)
//         );
//         if (isValid) {
//             const id = req.params.id;
//             let user = await User.findById(id);
//             // user = { ...user, ...newObj };
//             incomingFields.forEach(field => (user[field] = newObj[field]));
//             const updatedUser = await user.save();
//             // const updatedUser = await User.findByIdAndUpdate(id, newObj, {
//             //     new: true,
//             //     runValidators: true
//             // });
//             if (updatedUser) {
//                 return res.send(updatedUser);
//             }
//         }
//         return res.status(400).send("Bad Request");
//     } catch (e) {
//         console.log(e);
//         return res.status(500).send(e);
//     }
// });

// router.delete("/user/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const user = await User.findByIdAndRemove(id);
//         if (user) {
//             return res.send(user);
//         }
//         return res.status(400).send("No user found");
//     } catch (e) {
//         console.log(e);
//         return res.status(500).send(e);
//     }
// });

router.patch("/user", auth, async (req, res) => {
    try {
        const newObj = req.body;
        const allowedFields = ["age", "name", "email", "password"];
        const incomingFields = Object.keys(newObj);
        const isValid = incomingFields.every(elt => allowedFields.includes(elt));
        if (isValid) {
            let user = req.user;
            incomingFields.forEach(field => (user[field] = newObj[field]));
            const updatedUser = await user.save();
            return res.send(updatedUser);
        }
        return res.status(400).send("Bad Request");
    } catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
});

router.delete("/user", auth, async (req, res) => {
    try {
        const user = req.user;
        await user.remove();
        email.sendMail(user.email, user.name, false);
        res.send(user);
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findByCredentials(data.email, data.password);
        const token = await user.generateAuthToken();
        // const userObj = user.getPublicProfile();
        res.send({ user, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

// Middleware
const upload = multer({
    // dest: "images",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            cb(new Error("Wrong type"));
        } else {
            cb(undefined, true);
        }
    }
});

router.post(
    "/user/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        const fileBuffer = req.file.buffer;
        // Resized image
        const buffer = await sharp(fileBuffer)
            .resize({
                width: 250,
                height: 250
            })
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        // Error handling from middleware
        res.status(400).send(error.message);
    }
);

router.get("/user/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !(user && user.avatar)) {
            throw new Error();
        }
        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

router.delete("/user/avatar", auth, async (req, res) => {
    try {
        const user = req.user;
        user.avatar = undefined;
        await user.save();
        res.send();
    } catch (e) {
        res.status(400).send();
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        const user = req.user;
        const token = req.token;
        const newTokens = user.tokens.filter(elt => elt.token !== token);
        user.tokens = newTokens;
        user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
