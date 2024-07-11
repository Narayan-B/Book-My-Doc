const { validationResult } = require('express-validator');
const moment = require('moment');
const Availability = require('../models/availabilty-model');
const Slots = require('../models/slots-model');

const availabilityCltr = {};

// Create availability and generate slots
availabilityCltr.create = async (req, res) => {
    console.log("Create availability called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    const { consultationStartTime, consultationEndTime, consultationDays, consultationTimePerPatient } = req.body;
    const doctorId = req.user.id;

    try {

        const availability = new Availability({
            doctorId,
            consultationStartTime,
            consultationEndTime,
            consultationDays,
            consultationTimePerPatient
        });
        await availability.save();
        console.log("Availability saved:", availability);

        // Generate slots based on availability and save in Slots model
        const slotsData = generateSlotsData(consultationStartTime, consultationEndTime, consultationDays, consultationTimePerPatient);
        const slots = new Slots({
            doctorId,
            slots: slotsData
        });

        await slots.save();
        //console.log("Slots saved:", slots);
        return res.json({ availability, slots });
    } catch (err) {
        console.error('Error creating availability:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Helper function to generate slots data
function generateSlotsData(startTime, endTime, consultationDays, consultationTimePerPatient) {
    const slotsData = [];
    const timeSlots = generateTimeSlots(startTime, endTime, consultationTimePerPatient);

    consultationDays.forEach(day => {
        const currentDate = moment.utc(day).toDate(); // Convert to UTC date
        const formattedTimeSlots = timeSlots.map(time => moment.utc(time, 'hh:mm A').format('hh:mm A')); // Format time slots as strings
        slotsData.push({
            date: currentDate,
            timeSlots: formattedTimeSlots
        });
    });

    return slotsData;
}


// Helper function to generate time slots based on consultation time per patient
function generateTimeSlots(startTime, endTime, consultationTimePerPatient) {
    const timeSlots = [];
    const start = moment(startTime, 'hh:mm A');
    const end = moment(endTime, 'hh:mm A');
    const interval = parseInt(consultationTimePerPatient, 10); // Ensure this is a number

    let currentTime = start.clone();

    while (currentTime.isBefore(end)) {
        timeSlots.push(currentTime.format('hh:mm A'));
        currentTime.add(interval, 'minutes'); // Adjust interval based on consultation time per patient
    }

    return timeSlots;
}


// Update availability
availabilityCltr.update = async (req, res) => {
    console.log("Update availability called");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    const { consultationStartTime, consultationEndTime, consultationDays, consultationTimePerPatient } = req.body;
    const doctorId = req.user.id;

    try {
        // Update availability document
        let availability = await Availability.findOneAndUpdate({ doctorId }, req.body, { new: true });
        console.log("Availability updated:", availability);
        const slotsData = generateSlotsData(consultationStartTime, consultationEndTime, consultationDays, consultationTimePerPatient);
        let slots = await Slots.findOne({ doctorId });

        if (!slots) {
            slots = new Slots({
                doctorId,
                slots: slotsData
            });
        } else {
            slots.slots = slotsData;
        }
        await slots.save();
        console.log("Slots updated:", slots);
        return res.json({ availability, slots });
    } catch (err) {
        console.error('Error updating availability and slots:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


// Doctor availability
availabilityCltr.singleDoctorAvailability = async (req, res) => {
    console.log("Get single doctor availability called");
    try {
        const availability = await Availability.find({ doctorId: req.user.id });
        if (availability) {
            console.log("Availability found:", availability);
            return res.json(availability);
        } else {
            console.log("No availability found");
            return res.status(404).json([]);
        }
    } catch (err) {
        console.log('Error fetching availability:', err);
        return res.status(500).json('Internal server error');
    }
}

module.exports = availabilityCltr;
