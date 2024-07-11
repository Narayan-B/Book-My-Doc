const moment = require('moment');

const availabilityUpdateValidationSchema = {
    consultationStartTime: {
        exists: { errorMessage: 'Consultation start time is required' },
        notEmpty: { errorMessage: 'Consultation start time is required' },
        custom: {
            options: (value, { req }) => {
                const endTime = moment(req.body.consultationEndTime, 'hh:mm A');
                const consultationStartTime = moment(value, 'hh:mm A');

                if (!consultationStartTime.isValid()) {
                    throw new Error('Invalid consultation start time format');
                }
                if (consultationStartTime.isAfter(endTime)) {
                    throw new Error('Consultation start time should be before end time');
                }
                if (consultationStartTime.isBefore(moment('9:00 AM', 'hh:mm A'))) {
                    throw new Error('Consultation start time should be after 9:00 AM');
                }
                if (consultationStartTime.isSameOrAfter(moment('5:00 PM', 'hh:mm A'))) {
                    throw new Error('Consultation start time should be before 5:00 PM');
                }
                return true;
            }
        }
    },

    consultationEndTime: {
        exists: { errorMessage: 'Consultation end time is required' },
        notEmpty: { errorMessage: 'Consultation end time is required' },
        custom: {
            options: (value, { req }) => {
                const startTime = moment(req.body.consultationStartTime, 'hh:mm A');
                const consultationEndTime = moment(value, 'hh:mm A');

                if (!consultationEndTime.isValid()) {
                    throw new Error('Invalid consultation end time format');
                }
                if (consultationEndTime.isBefore(startTime)) {
                    throw new Error('Consultation end time should be after start time');
                }
                if (consultationEndTime.isAfter(moment('5:00 PM', 'hh:mm A'))) {
                    throw new Error('Consultation end time should be before 5:00 PM');
                }
                if (consultationEndTime.isSame(startTime)) {
                    throw new Error('Consultation end time should not be equal to start time');
                }
                return true;
            }
        }
    },

    consultationTimePerPatient: {
        exists: { errorMessage: 'Consultation time per patient is required' },
        notEmpty: { errorMessage: 'Consultation time per patient should not be empty' },
        trim: true
    },
    
    consultationDays: {
        exists: { errorMessage: 'Consultation days are required' },
        notEmpty: { errorMessage: 'Consultation days should not be empty' },
        isArray: { errorMessage: 'Consultation days should be an array' },
        custom: {
            options: (value) => {
                const today = moment().startOf('day');
                value.forEach(day => {
                    const consultationDay = moment(day, 'YYYY-MM-DD');
                    if (!consultationDay.isValid()) {
                        throw new Error(`Invalid date format for consultation day: ${day}`);
                    }
                    if (consultationDay.isBefore(today)) {
                        throw new Error(`Consultation day ${day} should not be before today's date`);
                    }
                });
                return true;
            }
        }
    }
};

module.exports = availabilityUpdateValidationSchema;
