const express = require("express");
const app = express();
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

// app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
//     console.log("this is the upload route!!");
//     console.log("input.....: ", req.body);
//     console.log("req.file...: ", req.file);
//     if (req.file) {
//         res.json({ success: true });
//     } else {
//         res.json({ success: false });
//     }
// });

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { title, description, username } = req.body;
    const imageUrl = `${s3Url}/${req.file.filename}`;
    // console.log("hello");
    db.addImage(imageUrl, username, title, description)
        .then(({ rows }) => {
            console.log(rows[0]);
            res.json(rows[0]);
        })
        .catch();
});

app.get("/images", (req, res) => {
    db.images()
        .then(function({ rows }) {
            // console.log(rows);
            res.json(rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/popup/:id", (req, res) => {
    // console.log(req.params);
    db.popup(req.params.id)
        .then(function({ rows }) {
            // console.log(rows);
            res.json(rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/comments", (req, res) => {
    console.log("just slash comments: ", req.body);
    const username = req.body.username;
    const comment = req.body.comment;
    const image_id = req.body.id;
    db.comments(username, comment, image_id)
        .then(function({ rows }) {
            console.log(rows);
            res.json(rows[0]);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/comments/:id", (req, res) => {
    console.log("meow: ", req.params);
    const image_id = req.params.id;
    db.getComments(image_id)
        .then(function({ rows }) {
            console.log(rows);
            res.json(rows);
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get("/loadMore/:id", (req, res) => {
    let lastimageId = req.params.id;
    db.loadImages(lastimageId)
        .then(results => {
            let rows = results.rows;
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(8080, () => console.log("imageboard working"));
