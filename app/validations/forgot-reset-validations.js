const forgotEmailValidationSchema=({
    email:{
        exists:{errorMessage:"email is required"},
        notEmpty:{errorMessage:"email should not be empty"},
        trim:true,
        isEmail:{errorMessage:'Email should be in valid format'},
        normalizeEmail:true
    }
})

const otpValidationSchema=({
    otp:{
        exists:{errorMessage:"Otp is required"},
        notEmpty:{erorMessage:"Otp should not be empty"},
        trim:true,
        isLength:{
            options:{min:6,max:6},
            errorMessage:"Otp should be 6 numbers"
        },
        isNumeric:'OTP should be a number'
    },
    newPassword: {
        exists: { errorMessage: 'Password is required' },
        notEmpty: { errorMessage: 'Password should not be empty' },
        isStrongPassword: { errorMessage: 'Password should be strong' },
        trim: true
    },
    email:{
        exists:{errorMessage:"email is required"},
        notEmpty:{errorMessage:"email should not be empty"},
        trim:true,
        isEmail:{errorMessage:'Email should be in valid format'},
        normalizeEmail:true
    }
})

module.exports={forgotEmailValidationSchema,otpValidationSchema}