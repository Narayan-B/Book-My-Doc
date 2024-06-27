const mongoose = require('mongoose');
const configureDB = async () => {
    try {
        const db = await mongoose.connect(process.env.DB_URL);
        console.log('DB connected successfully');
    } catch (err) {
        console.error(err);
    }
};

module.exports = configureDB;
