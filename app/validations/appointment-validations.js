const Appointment = require('../models/appointment-model');

const appointmentValidationSchema = {
    'patientDetails.name': {
        exists: { errorMessage: "Patient name is required" },
        notEmpty: { errorMessage: "Patient name should not be empty" },
        trim: true,
    },

    'patientDetails.age': {
        exists: { errorMessage: "Patient age is required" },
        notEmpty: { errorMessage: "Patient age should not be empty" },
        trim: true,
    },

    'patientDetails.gender': {
        exists: { errorMessage: "Patient gender is required" },
        notEmpty: { errorMessage: "Patient gender should not be empty" },
        trim: true,
        isIn: {
            options: [['Male', "Female", "Other"]],
            errorMessage: "Gender should be one of Male, Female, or Other"
        }
    },

    'patientDetails.weight': {
        exists: { errorMessage: "Patient weight is required" },
        notEmpty: { errorMessage: "Patient weight should not be empty" },
        trim: true,
    },

    'patientDetails.mobile': {
        exists: { errorMessage: "Patient mobile is required" },
        notEmpty: { errorMessage: "Patient mobile should not be empty" },
        trim: true,
    },

    'patientDetails.address': {
        exists: { errorMessage: "Patient address is required" },
        notEmpty: { errorMessage: "Patient address should not be empty" },
        trim: true,
    },

    appointmentDate: {
        exists: { errorMessage: "Booking Date is required" },
        notEmpty: { errorMessage: "Booking Date should not be empty" },
        trim: true,
        toDate: true,
        custom: {
            options: async (value, { req }) => {
                try {
                    const slot = await Appointment.findOne({
                        selectedSlot: value,
                        appointmentDate: req.body.appointmentDate,
                    });
                    if (slot) {
                        throw new Error('Slot is already booked by someone');
                    }
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        }
    },
    
    selectedSlot: {
        exists: { errorMessage: "Slot is required" },
        notEmpty: { errorMessage: "Slot should not be empty" },
        trim: true,
        isString: true,
        custom: {
            options: async function(value) {
                const slot = await Appointment.findOne({ selectedSlot: value });
                if (slot) {
                    throw new Error('Selected slot is already booked');
                }
                return true;
            }
        }
    }
};

module.exports = appointmentValidationSchema;
