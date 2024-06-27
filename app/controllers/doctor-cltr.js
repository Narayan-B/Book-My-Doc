const { validationResult } = require('express-validator');
const Doctor = require('../models/doctor-model');
const User=require('../models/user-model')
const {sendRejectionEmail,sendVerificationSuccessEmail}=require('../../utils/sendRejectionMail')
const doctorCtrl = {};

doctorCtrl.createProfile = async (req, res) => {
    //console.log(req.user.id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body
    try {
        
        const doctor = new Doctor(body);
        doctor.userId = req.user.id;
        doctor.profilePic=req.file.path

        // Save the doctor profile
        await doctor.save();

       return  res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

doctorCtrl.getProfile=async(req,res)=>{
    try{
        const profile=await Doctor.findOne({userId:req.user.id})
            return res.json(profile)
    }catch(err){
        console.log(err)
        return res.status(500).json("Something went wrong")
    }
}



doctorCtrl.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = req.body;

    try {
        // Find the doctor by userId
        const userId = req.user.id;
        let doctor = await Doctor.findOne({ userId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if a new profile picture is uploaded
        if (req.file) {
            body.profilePic = req.file.path; // Assuming req.file.path contains the path to the uploaded profile picture
        }

        // Update doctor's profile information
        doctor.set(body);

        // Save the updated doctor document
        doctor = await doctor.save();

        res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
doctorCtrl.verifyDoctor = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "verify" or "reject"
  
    try {
      // Find the doctor by id
      const doctor = await User.findOneAndUpdate(
        { _id: id, role: 'doctor' },
        { isVerified: action === 'verify' },
        { new: true }
      );
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Extract email and username from the user
      const { email, username } = doctor;
  
      // Send appropriate email based on the action
      if (action === 'verify') {
        //console.log(`Sending verification success email to: ${email}, ${username}`);
        await sendVerificationSuccessEmail(email, username);
        res.json({ message: 'Doctor verified and email sent successfully', doctor });
      } else if (action === 'reject') {
        //console.log(`Sending rejection email to: ${email}, ${username}`);
        await sendRejectionEmail(email, username);
        res.json({ message: 'Doctor rejected and email sent successfully', doctor });
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
    } catch (err) {
      //console.error('Error handling doctor verification:', err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

doctorCtrl.singleDoctor=async(req,res)=>{
    const id=req.params.id
    try{
        const doctor=await Doctor.findOne({userId:id}).populate("userId","-password")
        if(!doctor){
            return res.json('No doctor found')
        }
        return res.json(doctor)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });

    }
}



module.exports = doctorCtrl;
