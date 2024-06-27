const {Schema,model}=require('mongoose')
const availabiltySchema=new Schema({
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    consultationStartTime: String,
    consultationEndTime:String,
    consultationTimePerPatient:String,
    languagesSpoken: [String],
    consultationFees:Number
},{timestamps:true})
const Availabilty=model('Availability',availabiltySchema)
module.exports=Availabilty