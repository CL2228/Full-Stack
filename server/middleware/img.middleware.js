
const util = require("util");
const multer = require("multer");
const  { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db.config");


var storage = new GridFsStorage({
    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {

        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-cl2228-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}-cl2228-${file.originalname}`
        }
    }
});


var uploadFiles = multer( { storage: storage}).array("images", 9);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
// module.exports = storage;