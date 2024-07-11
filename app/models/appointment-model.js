const { Schema, model } = require('mongoose');

const appointmentSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    patientDetails: {
        name: { type: String },
        age: { type: String },
        gender: { type: String },
        weight: { type: Number },
        mobile: { type: Number },
        address: { type: String }
    },
    appointmentDate: Date,
    selectedSlot: String
}, { timestamps: true });

const Appointment=model('Appointment',appointmentSchema)

module.exports=Appointment