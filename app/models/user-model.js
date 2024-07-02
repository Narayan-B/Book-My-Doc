const {Schema,model}=require('mongoose')

//schema
const userSchema=new Schema({
    username:String,
    email:String,
    password:String,
    role:String,
    registrationNo:String,
    speciality:String,
    experienceCertificate:String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

//model
const User=model('User',userSchema)

module.exports=User