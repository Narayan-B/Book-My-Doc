const { Schema, model } = require('mongoose');

const slotSchema = new Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    slots: [
        {
            date: Date,
            timeSlots: [ String]
        }
    ]
}, { timestamps: true });

const Slots = model('Slots', slotSchema);

module.exports = Slots;
