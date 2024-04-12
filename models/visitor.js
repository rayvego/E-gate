const mongoose = require("mongoose")
const {v4: uuid} = require("uuid")

// defining schema
const visitorSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid, // Generate a new UUID for each new document
    },
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true
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
    }
})

const Visitor = mongoose.model("Visitor", visitorSchema)

module.exports = Visitor