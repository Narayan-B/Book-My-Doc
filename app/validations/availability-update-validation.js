
const moment = require('moment');

const availabilityUpdateValidationSchema = {
    consultationStartTime: {
        exists: { errorMessage: 'Consultation start time is required' },
        notEmpty:{errorMessage:' Consultaion start time is required'},
        custom: {
            options: (value, { req }) => {
                // Validate if consultation start time is in valid format (e.g., 9:00 AM)
                const startTime = moment('9:00 AM', 'hh:mm A');
                const consultationStartTime = moment(value, 'hh:mm A');
                if (!consultationStartTime.isValid()) {
                    throw new Error('Invalid consultation start time format');
                }
                if (consultationStartTime.isBefore(startTime)) {
                    throw new Error('Consultation start time should be after 9:00 AM');
                }
                return true;
            }
        }
    },
    consultationEndTime: {
        exists: { errorMessage: 'Consultation end time is required' },
        notEmpty:{errorMessage:' Consultaion end time is required'},
        custom: {
            options: (value, { req }) => {
                // Validate if consultation end time is in valid format (e.g., 5:00 PM)
                const endTime = moment('5:00 PM', 'hh:mm A');
                const consultationEndTime = moment(value, 'hh:mm A');
                if (!consultationEndTime.isValid()) {
                    throw new Error('Invalid consultation end time format');
                }
                if (consultationEndTime.isAfter(endTime)) {
                    throw new Error('Consultation end time should be before 5:00 PM');
                }
                return true;
            }
        }
        
    },
    languagesSpoken: {
        exists: { errorMessage: 'Languages is required' },
        notEmpty:{errorMessage:' Languages is required'},
        isArray: { errorMessage: 'Languages spoken should be an array' }
    },
    consultationFees:{
        exists: { errorMessage: 'ConsultationFees is required' },
        notEmpty:{errorMessage:' Consultaion Fees is required'},
        isNumeric:{errorMessage:'fees should be in number'}

    },
    doctorId:{
        custom:{
            options:async function(value,{req}){
                const doctor=await Availabilty.findOne({doctorId:req.user.id})
                if(doctor){
                    throw new Error('U created already u r availabilty')
                }
                return true
            }
        }
    }
};


module.exports = availabilityUpdateValidationSchema;
