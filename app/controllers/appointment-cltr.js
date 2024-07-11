const {validationResult}=require('express-validator')
const Appointment = require('../models/appointment-model');
const appointmentCltr={}

appointmentCltr.create=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    
    try{
        const appointment=new Appointment(body)
        appointment.appointmentDate= new Date(req.body.appointmentDate)
        appointment.patientId=req.user.id
        // console.log(appointment.patientId)
        // console.log(req.params.id)
        appointment.doctorId=req.params.id
        await appointment.save()
        res.json(appointment)

    }catch(err){
        console.log(err)
        res.status(500).json('Internal Server Error')
    }
}


module.exports = appointmentCltr;
