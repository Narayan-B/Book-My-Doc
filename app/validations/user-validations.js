const User = require('../models/user-model');

const userRegisterValidationSchema = {
    username: {
        exists: { errorMessage: 'Username is required' },
        notEmpty: { errorMessage: 'Username should not be empty' },
        trim: true
    },

    email: {
        exists: { errorMessage: 'Email is required' },
        notEmpty: { errorMessage: 'Email should not be empty' },
        isEmail: { errorMessage: 'Email should be in correct format' },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw new Error('Email already exists');
                }
                return true;
            }
        }
    },

    password: {
        exists: { errorMessage: 'Password is required' },
        notEmpty: { errorMessage: 'Password should not be empty' },
        isStrongPassword: { errorMessage: 'Password should be strong' },
        trim: true
    },
    
    role: {
        exists: { errorMessage: 'Role is required' },
        notEmpty: { errorMessage: 'Role should not be empty' },
        trim: true,
        isIn: {
            options: [['patient',  'admin']],
            errorMessage: 'Role should be one of patient, or admin'
        },
        custom: {
            options: async function (value, { req }) {
                if (value === 'admin') {
                    const user = await User.findOne({ role: 'admin' });
                    if (user) {
                        throw new Error('Only one admin can register');
                    }
                }
                return true;
            }
        }
    }
};

module.exports = userRegisterValidationSchema;



const doctorRegisterValidationSchema = {
    username: {
        exists: { errorMessage: 'Username is required' },
        notEmpty: { errorMessage: 'Username should not be empty' },
        trim: true
    },
    email: {
        exists: { errorMessage: 'Email is required' },
        notEmpty: { errorMessage: 'Email should not be empty' },
        isEmail: { errorMessage: 'Email should be in correct format' },
        trim: true,
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw new Error('Email already exists');
                }
                return true;
            }
        }
    },
    password: {
        exists: { errorMessage: 'Password is required' },
        notEmpty: { errorMessage: 'Password should not be empty' },
        isStrongPassword: { errorMessage: 'Password should be strong' },
        trim: true
    },
    role: {
        exists: { errorMessage: 'Role is required' },
        notEmpty: { errorMessage: 'Role should not be empty' },
        trim: true,
        isIn: {
            options: [['doctor']],
            errorMessage: 'Role should be doctor'
        }
    },
    registrationNo: {
        exists: { errorMessage: 'Registration number is required' },
        notEmpty: { errorMessage: 'Registration number should not be empty' },
        trim: true
    },
    speciality: {
        exists: { errorMessage: 'Speciality is required' },
        notEmpty: { errorMessage: 'Speciality should not be empty' },
        trim: true
    },
    experienceCertificate: {
        custom: {
            options: (value, { req }) => {
                //console.log('validation',req.file.fieldname)
                if ( req.file.fieldname !=='experienceCertificate') {
                    throw new Error('Experience certificate is required');
                }
                const file = req.file;
                const allowedTypes = ['application/pdf'];
                if (!allowedTypes.includes(file.mimetype)) {
                    throw new Error('Invalid file type');
                }
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size exceeds 5MB');
                }
                return true;
            }
        }
    },
    // isVerified:{
    //     exists: { errorMessage: 'isVerified is required' },
    //     notEmpty: { errorMessage: 'isVerified should not be empty' },
    //     trim: true
       
    // }
}
const userLoginValidations={
    email: {
        exists: { errorMessage: 'Email is required' },
        notEmpty: { errorMessage: 'Email should not be empty' },
        isEmail: { errorMessage: 'Email should be in correct format' },
        trim: true,
        normalizeEmail: true,
    },
    password: {
        exists: { errorMessage: 'Password is required' },
        notEmpty: { errorMessage: 'Password should not be empty' },
        isStrongPassword: { errorMessage: 'Password should be strong' },
        trim: true
    }

}

module.exports = {doctorRegisterValidationSchema,userRegisterValidationSchema,userLoginValidations}
