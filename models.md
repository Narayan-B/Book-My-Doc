# user model
## role ==='patient'
username: String,
email: String,
password: String,
role: String,
resetPasswordExpires: String,
resetPasswordToken : String

## role ==='doctor'
username: String,
email: String,
password: String,    
role: String,
registrationNo: String,
speciality: String,
experienceCertificate: String,
resetPasswordToken: String,
resetPasswordExpires: Date,
isVerified:{
    type:Boolean,
    default:false
}
resetPasswordExpires: String
resetPasswordToken: String

# profile
## role=='patient'
userId:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    firstName: String,
    lastName: String,
    mobile: String,
    address: String,
    pincode: String,
    profilePic: String

## role=='doctor'

userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    firstName: String,
    lastName: String,
    gender: String,
    mobile: String,
    profilePic: String,
    hospitalName: String,
    hospitalAddress: {
        street: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },
    yearsOfExperience: Number
    languagesSpoken: [String],
    consultationFees:Number

# DoctorAvailability
    doctorId:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
    consultationStartDateTime: Date,
    consultationEndDateTime: Date,
    consultationTimePerPatient: String

## Slots
doctor
availableDate
slots: [
    {
        date: Date,
        time:[ String ]
    }
]
    
# Appointment

patientId:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
doctorId:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
patientDetails: {
    name: String,
    dob: String,
    age: String,
    gender: String,
    weight: Nummber,
    mobile: Number,
    address: String
}
appointmentDatetime: String
Slot: ObjectId,
status:{
    type: String,
    default: pending
}

# payment 

# Reviews
reviewId: String
appointmentId: {
    type: String,
    ref: 'Appointment'
}
rating: Number
comments: String
