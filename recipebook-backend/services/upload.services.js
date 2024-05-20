const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.IMAGE_DIR);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if(ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
        cb(new Error('not image'), false);
    }
    else {
        cb(null, true);
    }
}

module.exports = multer({storage: multerStorage, fileFilter: multerFilter});