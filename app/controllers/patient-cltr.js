const { validationResult } = require('express-validator');
const Patient = require('../models/patient-model');
const patientCltr={}

//create patientProfile
patientCltr.createProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body=req.body
    try{
        const patient=new Patient(body)
        //console.log(patient)
        patient.userId=req.user.id
        patient.profilePic=req.file.path
        await patient.save()
        res.json(patient)
    }catch(err){
        console.log(err)
        res.status(500).json('something went wrong')
    }
}


//get patientProfile
patientCltr.getProfile=async(req,res)=>{
    try{
        const profile=await Patient.findOne({userId:req.user.id})
            return res.json(profile)
    }catch(err){
        console.log(err)
        return res.status(500).json("Something went wrong")
    }
}


//update patientProfile
patientCltr.updateProfile=async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, mobile, address, pincode } = req.body;
    const userId = req.user.id; 
    try {
        let patient = await Patient.findOne({ userId });

        if (!patient) {
            return res.status(400).json({ msg: 'No patient found' });
        }
        patient.firstName = firstName;
        patient.lastName = lastName;
        patient.mobile = mobile;
        patient.address = address;
        patient.pincode = pincode;

        if (req.file) {
            patient.profilePic = req.file.path;
        } else {
            if (!patient.profilePic) {
                const existingPatient = await Patient.findOne({ userId });
                patient.profilePic = existingPatient.profilePic;
            }
        }
        await patient.save();
        res.json(patient); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


module.exports=patientCltr