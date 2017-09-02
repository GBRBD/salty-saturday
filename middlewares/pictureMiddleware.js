const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

/**
 * Multer options
 */
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

/**
 * Upload a single photo
 */
exports.upload = multer(multerOptions).single('photo');

/**
 * Picture resize, rename and save to disc
 */
exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file) {
        next(); // skip to the next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // Rename, resize, save
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(350, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once we have written the photo to our filesystem, keep going!
    next();
};