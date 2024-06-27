require('dotenv').config()
const express=require('express')
const cors=require('cors')
const helmet=require('helmet')
const compression=require('compression')
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');



const configureDB=require('./config/db')
const { checkSchema } = require('express-validator')

const port=5555
const app=express()
configureDB()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/profilePics', express.static(path.join(__dirname, 'profilePics')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

const upload=require('./app/middlewares/multerConfig')
const profile=require('./app/middlewares/profileMulter')


const {userRegisterValidationSchema,doctorRegisterValidationSchema, userLoginValidations}=require('./app/validations/user-validations')
const userCltr=require('./app/controllers/user-cltr')
const authenticateUser = require('./app/middlewares/authenticateUser')
const authorizeUser = require('./app/middlewares/authorizeUser')
const patientCltr = require('./app/controllers/patient-cltr')
const patientProfileValidationSchema = require('./app/validations/patient-profile-validation')
const patientProfileUpdateValidationSchema=require('./app/validations/patient-profile-update-validation')
const doctorProfileValidationSchema = require('./app/validations/doctor-profile-validation')
const doctorProfileUpdateValidationSchema=require('./app/validations/doctor-profile-update-validation')
const doctorCtrl = require('./app/controllers/doctor-cltr')
const availabilityValidationSchema = require('./app/validations/availabilty-validations')
const availabilityCltr = require('./app/controllers/availabilty-cltr')
const availabilityUpdateValidationSchema = require('./app/validations/availability-update-validation')
const {forgotEmailValidationSchema,otpValidationSchema} = require('./app/validations/forgot-reset-validations')



app.post('/api/users/register',checkSchema(userRegisterValidationSchema),userCltr.registerUser)
app.post('/api/doctor/register',upload.single('experienceCertificate'),checkSchema(doctorRegisterValidationSchema),userCltr.registerDoctor)
app.get('/api/users/checkemail',userCltr.checkEmail)
app.get('/api/adminExists',userCltr.adminExists)
app.post('/api/users/login',checkSchema(userLoginValidations),userCltr.login)
app.get('/api/users/account',authenticateUser,authorizeUser(['admin','patient','doctor']),userCltr.account)

app.post('/api/forgot-password',checkSchema(forgotEmailValidationSchema),userCltr.forgotPassword)
app.post('/api/reset-password',checkSchema(otpValidationSchema),userCltr.resetPassword)

app.get('/api/verified-doctors',userCltr.allVerifiedDoctors)
app.get('/api/all-doctors',authenticateUser,authorizeUser(['admin']),userCltr.allDoctors)
app.get('/api/single-doctor/:id',doctorCtrl.singleDoctor)
app.get('/api/all-patients',authenticateUser,authorizeUser(['admin']),userCltr.allPatients)
//app.put('/api/verify-doctor/:id',authenticateUser,authorizeUser(['admin']),userCltr.verify)
app.post('/api/patient/profile',authenticateUser,authorizeUser(['patient','admin']),profile.single('profilePic'),checkSchema(patientProfileValidationSchema),patientCltr.createProfile)
app.get('/api/patient/profile',authenticateUser,authorizeUser(['patient','admin']),patientCltr.getProfile)
app.put('/api/patient/profile',authenticateUser,authorizeUser(['patient','admin']),profile.single('profilePic'),checkSchema(patientProfileUpdateValidationSchema),patientCltr.updateProfile)

app.post('/api/doctor/profile',authenticateUser,authorizeUser(['doctor']),profile.single('profilePic'),checkSchema(doctorProfileValidationSchema),doctorCtrl.createProfile)
app.put('/api/doctor/profile',authenticateUser,authorizeUser(['doctor']),profile.single('profilePic'),checkSchema(doctorProfileUpdateValidationSchema),doctorCtrl.updateProfile)
app.get('/api/doctor/profile',authenticateUser,authorizeUser(['doctor']),doctorCtrl.getProfile)
app.post('/api/doctor/availability',authenticateUser,authorizeUser(['doctor']),checkSchema(availabilityValidationSchema),availabilityCltr.create)
app.get( '/api/doctor/availability',availabilityCltr.allDoctors)
app.put('/api/doctor-verification/:id',authenticateUser,authorizeUser(['admin']),doctorCtrl.verifyDoctor)
app.put('/api/doctor/availability',authenticateUser,authorizeUser(['doctor']),checkSchema(availabilityUpdateValidationSchema),availabilityCltr.update)
app.listen(port,()=>{
    console.log(`server connected to port ${port}`)
})