const express = require("express")
const app = express()
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const Resident = require('./models/residents');
const Visitor = require('./models/visitor');

const firebase = require("firebase/app");
require("firebase/auth");

const firebaseConfig = {
    // Your Firebase Config from the Firebase Console
};

firebase.initializeApp(firebaseConfig);

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => {
        console.log("Connection Successful")
    })
    .catch(err => {
        console.log("Connection Failed")
        console.log(err)
    })

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.json())

app.get("/resident_sign_up", (req, res) => {
    res.render("resident_sign_up")
})

app.post("/resident_sign_up", async (req, res) => {
    const { email, password, name, pnumber, identification_code } = req.body;

    try {
        // Create a Firebase user with email and password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        // Save additional user data to MongoDB
        const newResident = new Resident({
            name: name,
            password: password,
            phone_number: pnumber,
            email_id: email,
            identification_code: identification_code,
            // You might want to save the Firebase UID for linking purposes
            firebase_uid: userCredential.user.uid
        });

        const savedResident = await newResident.save();
        console.log("New Resident added:", savedResident);

        res.redirect("/home");
    } catch (error) {
        console.error("Error adding Resident:", error.message);
        res.redirect("/error");
    }
});


app.get("/visitor_sign_up", (req, res) => {
    res.render("visitor_sign_up")
})

app.post("/visitor_sign_up", async (req, res) => {
    const { name, phone_number, vehicle_number, entryDate, tenure_hours } = req.body;

    try {
        // Create a Firebase user for Visitors (you can modify this as needed)
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(`${phone_number}@example.com`, "randompassword");

        // Save additional visitor data to MongoDB
        const newVisitor = new Visitor({
            name: name,
            phone_number: phone_number,
            vehicle_number: vehicle_number,
            entry: entryDate,
            tenure_hours: tenure_hours,
            firebase_uid: userCredential.user.uid // Save the Firebase UID
        });

        const savedVisitor = await newVisitor.save();
        console.log("New Visitor added:", savedVisitor);

        res.redirect("/home");
    } catch (error) {
        console.error("Error adding Visitor:", error.message);
        res.redirect("/error");
    }
});

app.post("/login", (req, res) => {

})

app.get("/", (req, res) => {
    res.render("home")
})

app.use((req, res) => {
    console.log("Got a request!")
    res.send("This is a response")
})

app.listen(5000, () => {
    console.log("Listening on port 5000")
})