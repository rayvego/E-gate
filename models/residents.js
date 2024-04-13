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
        match: [
            /^[a-zA-Z0-9._%+-]+@iitgn\.ac\.in$/,
            "Please enter a valid IITGN email address",
        ],
    },
    identification_code: {
        type: Number,
        // required: true,
        unique: true
    },
    otp: {
        type: String,
        required: false,
    }
})

const Resident = mongoose.model("Resident", residentSchema)

module.exports = Resident