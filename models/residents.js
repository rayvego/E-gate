const mongoose = require("mongoose")

// defining schema
const residentSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
        // unique: true
    },
    email_id: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    identification_code: {
        type: Number,
        // required: true,
        unique: true
    },
    firebase_uid: {
        type: String, // Store the Firebase UID here
        required: true,
        unique: true,
    },
})

const Resident = mongoose.model("Resident", residentSchema)

module.exports = Resident