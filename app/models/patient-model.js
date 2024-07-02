const {Schema, model }= require('mongoose');

const patientSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    firstName:String,
    lastName:String,
    mobile:String,
    address:String,
    pincode:String,
    profilePic:String
},{timestamps:true});

const Patient = model('Patient', patientSchema);

module.exports = Patient;
