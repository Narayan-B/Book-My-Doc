const { validationResult } = require('express-validator')
const Availability=require('../models/availabilty-model')
const availabilityCltr={}
availabilityCltr.create=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    try{
        const availability=new Availability(body)
        availability.doctorId=req.user.id
        await availability.save()
        return res.json(availability)

    }catch(err){
        console.log(err)
        return res.status(500).json('Internal server error')
    }
}
availabilityCltr.update=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body=req.body
    //console.log(body)
    try{
        const availability=await Availability.findOneAndUpdate({doctorId:req.user.id},body,{new:true})
        //console.log(availability)
        await availability.save()
        return res.json(availability)

    }catch(err){
        console.log(err)
        return res.status(500).json('Internal server error')
    }

}
availabilityCltr.allDoctors=async(req,res)=>{
    
    try{
        const doctors=await Availability.find()
        console.log(doctors)
        if(!doctors){
            return res.status(404).json('No doctors at this moment')
        }
       return res.json(doctors)

    }catch(err){
        console.log(err)
        return res.status(500).json('Internal server error')

    }
}
module.exports=availabilityCltr
