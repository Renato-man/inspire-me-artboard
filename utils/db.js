var spicedPg = require("spiced-pg");
// const bcrypt = require("./bcrypt");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.images = function() {
    return db.query("SELECT * FROM images ORDER BY id DESC LIMIT 9");
};

module.exports.popup = function(id) {
    return db.query("SELECT * FROM images WHERE id = $1", [id]);
};

module.exports.addImage = function(url, username, title, description) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING *;",
        [url, username, title, description]
    );
};

module.exports.comments = function(username, comment_text, image_id) {
    return db.query(
        "INSERT INTO comments (username, comment_text, image_id) VALUES($1, $2, $3) RETURNING *;",
        [username, comment_text, image_id]
    );
};

module.exports.getComments = function(image_id) {
    return db.query("SELECT * FROM comments WHERE image_id = $1", [image_id]);
};

module.exports.loadImages = function(image_id) {
    return db.query("SELECT * FROM images WHERE id < $1 ORDER BY id DESC", [
        image_id
    ]);
};

// ORDER BY desc LIMIT 10
//
// query to get more images
//
//
// SELECT * FROM images
// ORDER BY id desc
// LIMIT 10
//
// SELECT * FROM images
// WHERE ID < $1
// ORDER BY id desc
// LIMIT 10
//
// SELECT id FROM images
// ORDER BY id ASC

// SELECT * (
//     SELECT id FROM images
//     ORDER BY id ASC
//     LIMIT 1
// ) AS "lowestId" FROM images
// WHERE id < $1
// ORDER BY id desc
// LIMIT 10;
//
// this.images[this.images.length - 1].id;
