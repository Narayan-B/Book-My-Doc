const {Schema,model} = require('mongoose');

const doctorSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    firstName: String,
    lastName: String,
    gender: String,
    mobile: String,
    profilePic:String,
    hospitalName:String,
    hospitalAddress: {
        street: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
        },
    yearsOfExperience: Number,
    languagesSpoken: [String],
    consultationFees:Number
},{timestamps:true});

const Doctor =model('Doctor', doctorSchema);

module.exports = Doctor;
