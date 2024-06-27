// multerConfig.js

const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the destination folder where the files will be stored
        cb(null, 'uploads'); // Create a folder named 'uploads' in your project root directory
    },
    filename: (req, file, cb) => {
        // Define the filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Multer file filter
const fileFilter = (req, file, cb) => {
    // Check file type
    if ( file.mimetype === 'application/pdf' ) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type'), false); // Reject the file
    }
};

// Initialize Multer with the configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
