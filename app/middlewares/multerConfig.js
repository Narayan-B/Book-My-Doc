const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    if ( file.mimetype === 'application/pdf' ) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

// Initialize Multer with the configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
