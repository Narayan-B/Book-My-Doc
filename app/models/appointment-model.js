const {Schema,model}=require('mongoose')
const appointmentSchema=new Schema({
    patient:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    date:String,
    time:String,
    status:{
        type:String,
        default:'Pending'
    }
},{timestamps:true})
const Appointment=model('Appointment',appointmentSchema)
module.exports=Appointment