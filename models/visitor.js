const mongoose = require("mongoose")

// defining schema
const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    vehicle_number: {
        type: String,
        unique: true
    },
    entry: {
        type: Date,
        default: Date.now,
        required: true
    },
    tenure_hours: {
        type: Number,
        required: true
    },
    is_expired: {
        type: Boolean,
        default: false
    },
    qr: {
        type: Buffer,
        default: null
    },
    scanCount: {
        type: Number,
        default: 0
    }
})

const Visitor = mongoose.model("Visitor", visitorSchema)

module.exports = Visitor