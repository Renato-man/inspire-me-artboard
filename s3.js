const aws = require("aws-sdk");
const fs = require("fs");

let secrets;

if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.keyid,
    secretAccessKey: secrets.secret
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log("no req.file");
        res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    })
        .promise()
        .then(() => {
            //yay it worked
            next();
            fs.unlink(path, () => {});
        })
        .catch(err => {
            console.log(err);
            //it didnt work
            res.sendStatus(500);
        });
};
