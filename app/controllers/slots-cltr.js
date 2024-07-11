const Slots=require('../models/slots-model')
const slotsCltr={}

slotsCltr.get=async(req,res)=>{
    const id=req.params.id
    const slots=await Slots.findOne({doctorId:id})
    if(slots){
        return res.json(slots)
    }else{
        return res.json('Doctor is not avaialble this moment')
    }
}

module.exports=slotsCltr