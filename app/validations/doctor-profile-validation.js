const Patient = require('../models/patient-model'); // Importing the User model
const Doctor = require('../models/doctor-model');

const doctorProfileValidationSchema = {
    userId: {
        custom: {
            options: async function(value, { req }) {
                const doctor = await Doctor.findOne({ userId: req.user.id });
                if (doctor) {
                    throw new Error("Doctor profile already created");
                }
                return true;
            }
        }
    },

    firstName: {
        exists: { errorMessage: 'First name is required' },
        notEmpty: { errorMessage: 'First name should not be empty' },
        trim: true
    },

    lastName: {
        exists: { errorMessage: 'Last name is required' },
        notEmpty: { errorMessage: 'Last name should not be empty' },
        trim: true
    },

    gender: {
        exists: { errorMessage: 'Gender is required' },
        isIn: {
            options: [['Male', 'Female', 'Other']],
            errorMessage: 'Gender must be one of "Male", "Female", "Other"'
        }
    },

    mobile: {
        exists: { errorMessage: 'Phone number is required' },
        notEmpty: { errorMessage: 'Phone number should not be empty' },
        isMobilePhone: { errorMessage: 'Phone number should be valid' },
        custom:{
            options:async function(value){
                const patient=await Patient.findOne({mobile:value})
                const doctor=await Doctor.findOne({mobile:value})
                if(patient || doctor){
                    throw new Error('mobile no already exists')
                }
                return true
            }
        }
    },  

    profilePic: {
        custom: {
            options: (value, { req }) => {
                if (!req.file) {
                    throw new Error('Profile picture is required');
                }
                const file = req.file;
                const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                if (!allowedTypes.includes(file.mimetype)) {
                    throw new Error('Invalid file type');
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size should not exceed 5MB');
                }
                return true;
            }
        }
    },

    hospitalName:{
        exists:{errorMessage:"Hospital Name is required"},
        notEmpty:{errorMessage:"Hospital Name should not be empty"},
        trim:true
    },

    'hospitalAddress.street': {
        exists: { errorMessage: 'Street address is required' },
        notEmpty: { errorMessage: 'Street address should not be empty' },
        trim: true
    },

    'hospitalAddress.city': {
        exists: { errorMessage: 'City is required' },
        notEmpty: { errorMessage: 'City should not be empty' },
        trim: true
    },

    'hospitalAddress.state': {
        exists: { errorMessage: 'State is required' },
        notEmpty: { errorMessage: 'State should not be empty' },
        trim: true
    },

    'hospitalAddress.pinCode': {
        exists: { errorMessage: 'Zip code is required' },
        notEmpty: { errorMessage: 'Zip code should not be empty' },
        trim: true,
        custom:{
            options: (value) => {
                // Validate pin code format (6 digits)
                const pincodeRegex = /^[1-9][0-9]{5}$/;
                if (!pincodeRegex.test(value)) {
                    throw new Error('Invalid pin code. Please enter a valid 6-digit pin code');
                }
                return true;
            }
        }
    },

    'hospitalAddress.country': {
        exists: { errorMessage: 'Country is required' },
        notEmpty: { errorMessage: 'Country should not be empty' },
        trim: true
    },

    yearsOfExperience: {
        exists: { errorMessage: 'Years of experience is required' },
        isInt: { errorMessage: 'Years of experience should be a valid number' }
    }
};

module.exports = doctorProfileValidationSchema;
