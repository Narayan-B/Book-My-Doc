const doctorProfileUpdateValidationSchema = {

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
                    throw new Error('Invalid pin code. Please enter a valid 6-digit pin code')
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

module.exports = doctorProfileUpdateValidationSchema;
