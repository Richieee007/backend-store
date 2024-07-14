const mongoose = require('./db');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

module.exports = (req, res) => {
    upload.single('product')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ success: 0, error: err.message });
        }
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
    });
};
