// const express = require("express")
// const app = express()
// const path = require("path")
// const methodOverride = require("method-override")
import axios from 'axios';
const mongoose = require("mongoose")
const Resident = require('./models/residents');
const Visitor = require('./models/visitor');

// mongoose.connect('mongodb://127.0.0.1:27017/test')
//     .then(() => {
//         console.log("Connection Successful")
//     })
//     .catch(err => {
//         console.log("Connection Failed")
//         console.log(err)
//     })


// Get references to all buttons
const allButton = document.getElementById("all");
const residentButton = document.getElementById("resident");
const visitorButton = document.getElementById("visitor");

// Add event listeners to each button
allButton.addEventListener("click", function() {
    console.log("HOII")
    // Handle click on 'All' button
    axios.get('http://localhost:5000/admin-area')
        .then(response => {
            // Success!
            console.log(response.data); // Access the retrieved data
        })
        .catch(error => {
            // Handle error
            console.error(error);
        });

});

residentButton.addEventListener("click", function() {
    // Handle click on 'Resident' button
    axios.get('http://localhost:5000/admin-area-resident')
        .then(response => {
            // Success!
            console.log(response.data); // Access the retrieved data
        })
        .catch(error => {
            // Handle error
            console.error(error);
        });

});

visitorButton.addEventListener("click", function() {
    // Handle click on 'Visitor' button
    axios.get('http://localhost:5000/admin-area-visitor')
        .then(response => {
            // Success!
            console.log(response.data); // Access the retrieved data
        })
        .catch(error => {
            // Handle error
            console.error(error);
        });
});