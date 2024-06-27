const { validationResult } = require('express-validator');
const Patient = require('../models/patient-model');
const patientCltr={}

patientCltr.createProfile = async (req, res) => {
    // Check for validation errors
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
patientCltr.getProfile=async(req,res)=>{
    try{
        const profile=await Patient.findOne({userId:req.user.id})
            return res.json(profile)
    }catch(err){
        console.log(err)
        return res.status(500).json("Something went wrong")
    }
}
patientCltr.updateProfile=async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, mobile, address, pincode } = req.body;
    const userId = req.user.id; // Assuming userId is extracted from JWT token or session

    try {
        // Find the patient by userId and update the fields
        let patient = await Patient.findOne({ userId });

        if (!patient) {
            return res.status(400).json({ msg: 'No patient found' });
        }

        // Update the patient document with the new fields
        patient.firstName = firstName;
        patient.lastName = lastName;
        patient.mobile = mobile;
        patient.address = address;
        patient.pincode = pincode;

        // Handle profilePic update or fallback to existing profilePic
        if (req.file) {
            patient.profilePic = req.file.path; // Update with new profilePic path
        } else {
            // If no new file uploaded, retain the existing profilePic
            if (!patient.profilePic) {
                const existingPatient = await Patient.findOne({ userId });
                patient.profilePic = existingPatient.profilePic;
            }
        }

        // Save the updated patient document
        await patient.save();

        res.json(patient); // Return the updated patient document
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports=patientCltr