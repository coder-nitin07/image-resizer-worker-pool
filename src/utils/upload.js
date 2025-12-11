const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')   // temp upload folder
    },

    filename: function (req, file, cb){
        const uniquename = Date.now() + '-' + file.originalname;
        cb(null, uniquename);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

module.exports = upload;