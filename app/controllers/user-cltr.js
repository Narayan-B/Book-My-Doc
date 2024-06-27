const { validationResult } = require('express-validator');
const { pick } = require('lodash');
const bcryptjs = require('bcryptjs');
const User = require('../models/user-model');
const Profile=require('../models/doctor-model')
const jwt=require('jsonwebtoken')
const {sendOTPEmail}=require('../../utils/sendRejectionMail')

const userCtrl = {};

userCtrl.registerUser = async (req, res) => {
    console.log(req.body.role)
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password, role } = req.body;
        

        // Hash the password
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json(newUser); // Return the newly created user
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

userCtrl.registerDoctor = async (req, res) => {
    //console.log(req.file.path)
    console.log(req.body)
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
       

        const { username, email, password, role, registrationNo, speciality } = req.body;

        // Hash the password
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new doctor instance
        const newDoctor = new User({
            username,
            email,
            password: hashedPassword,
            role,
            registrationNo,
            speciality,
           // Assuming Multer middleware is used to handle file upload
        });
        newDoctor.experienceCertificate=req.file.path
        
        

        // Save the doctor to the database
        await newDoctor.save();

        res.status(201).json(newDoctor); // Return the newly created doctor
    } catch (error) {
        console.error('Error registering doctor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
userCtrl.checkEmail = async (req, res) => {
    const { email } = req.query;
    //const email=req.query.email
    try{
        const user=await User.findOne({email})
        if(user){
            res.json({exists:true})
        }else{
            res.json({exists:false})
        }

    }catch(err){
        res.status(500).json('something went wrong')
    }
}
userCtrl.login=async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   const body=req.body
   try{
    const user=await User.findOne({email:body.email})
    if(user){
        const isAuth=await bcryptjs.compare(body.password,user.password)
        if(isAuth){
            const tokenData={
                id:user._id,
                role:user.role
            }
            const token=jwt.sign(tokenData,process.env.SECRET,{expiresIn:'3d'})
            return res.json({token:token})
        }
        return res.status(400).json('Email/password is worng')
    }
     return res.status(400).json('Email/password is worng')
   }catch(err){
        console.error( err);
        res.status(500).json({ error: 'Internal server error' })

    }
    
}
userCtrl.account=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json('no user found find with this id')
        }
         return res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


userCtrl.allVerifiedDoctors = async (req, res) => {
    try {
        // Find profiles and populate the userId field with corresponding user details
        const profiles = await Profile.find().populate('userId');

        // Filter profiles based on the user's role and verification status
        const doctors = profiles.filter(profile => 
            profile.userId && 
            profile.userId.role === 'doctor' && 
            profile.userId.isVerified
        );
        

        if (doctors.length === 0) {
            return res.status(404).json('No verified doctors found');
        }

        return res.json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

userCtrl.adminExists=async(req,res)=>{
    try{
        const adminExists=await User.findOne({role:'admin'})
        console.log(adminExists)
        if(adminExists){
            return res.json({adminExists:true})
        }else{
            return res.json({adminExists:false})
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });

    }
}

userCtrl.allDoctors=async(req,res)=>{
    try{
        const doctors=await User.find({role:'doctor'})
        return res.json(doctors)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });

    }
}

userCtrl.allPatients=async(req,res)=>{
    try{
        const patients=await User.find({role:'patient'})
        return res.json(patients)
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });

    }
}

userCtrl.forgotPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body; // Only email is needed
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No user found registered with this email' });
      }
  
      // Send OTP email and get the OTP
      const otp = await sendOTPEmail(email,user.username);
  
      // Store the OTP in the user's record with an expiration time (e.g., 10 minutes)
      user.resetPasswordToken = otp;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  userCtrl.resetPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, otp, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if OTP is valid and not expired
      if (user.resetPasswordToken !== otp || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Hash the new password and save it
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOTP = undefined; // Clear the OTP fields
      user.otpExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = userCtrl
