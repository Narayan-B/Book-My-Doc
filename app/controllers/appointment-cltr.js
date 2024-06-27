const moment = require('moment');
const Appointment = require('../models/appointment-model');
const Availability = require('../models/availability-model');

// Helper function to generate 20-minute time slots within a given range
const generateTimeSlots = (start, end) => {
    const startTime = moment(start, 'hh:mm A');
    const endTime = moment(end, 'hh:mm A');
    const timeSlots = [];

    while (startTime.isBefore(endTime)) {
        const slotEndTime = moment(startTime).add(20, 'minutes');
        if (slotEndTime.isAfter(endTime)) break;
        timeSlots.push({
            start: startTime.format('hh:mm A'),
            end: slotEndTime.format('hh:mm A')
        });
        startTime.add(20, 'minutes');
    }

    return timeSlots;
};

// Function to validate if the appointment time falls within the doctor's availability
const validateAppointmentTime = async (doctorId, appointmentDate, appointmentStartTime) => {
    const availability = await Availability.findOne({ doctorId });
    if (!availability) {
        throw new Error('Doctor availability not found');
    }

    const requestedMoment = moment(appointmentDate, 'YYYY-MM-DD');
    const requestedDayName = requestedMoment.format('dddd');

    if (!availability.consultationDays.includes(requestedDayName)) {
        throw new Error(`Doctor does not work on ${requestedDayName}`);
    }

    // Generate 20-minute slots within consultation hours
    const slots = generateTimeSlots(availability.consultationStartTime, availability.consultationEndTime);
    const requestedStartTime = moment(appointmentStartTime, 'hh:mm A');
    const requestedEndTime = moment(appointmentStartTime, 'hh:mm A').add(20, 'minutes');

    const isWithinSlot = slots.some(slot => {
        const slotStartTime = moment(slot.start, 'hh:mm A');
        const slotEndTime = moment(slot.end, 'hh:mm A');
        return requestedStartTime.isSameOrAfter(slotStartTime) && requestedEndTime.isSameOrBefore(slotEndTime);
    });

    if (!isWithinSlot) {
        throw new Error('Requested time slot is not within the available 20-minute slots');
    }

    const existingAppointments = await Appointment.find({
        doctorId,
        appointmentDate,
        $or: [
            { appointmentStartTime: { $lte: requestedEndTime.format('hh:mm A') }, appointmentEndTime: { $gte: requestedStartTime.format('hh:mm A') } }
        ]
    });

    if (existingAppointments.length > 0) {
        throw new Error('The requested time slot is already booked');
    }

    return true;
};

// Controller to handle appointment booking
const appointmentCltr = {};

appointmentCltr.createAppointment = async (req, res) => {
    const { doctorId, appointmentDate, appointmentStartTime, patientDetails } = req.body;

    try {
        await validateAppointmentTime(doctorId, appointmentDate, appointmentStartTime);

        const newAppointment = new Appointment({
            doctorId,
            patientId: req.user.id,
            appointmentDate,
            appointmentStartTime,
            appointmentEndTime: moment(appointmentStartTime, 'hh:mm A').add(20, 'minutes').format('hh:mm A'),
            patientDetails
        });

        await newAppointment.save();

        res.status(201).json(newAppointment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = appointmentCltr;
