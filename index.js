const express = require("express")
const app = express()
const path = require("path")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const Resident = require('./models/residents');
const Visitor = 


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

app.get("/login", (req, res) => {
    res.render("initialise")
})

app.get("/resident_sign_up", (req, res) => {
    res.render("resident_sign_up")
})

app.post("/resident_sign_up", async (req, res) => {
    const { email, password, name, pnumber, identification_code } = req.body;

    try {
        // Create a new Resident instance with form data
        const newResident = new Resident({
            name: name,
            password: password,
            phone_number: pnumber,
            email_id: email,
            identification_code: identification_code
        });

        // Save the newResident to the database
        const savedResident = await newResident.save();

        console.log("New Resident added:", savedResident);

        // Redirect to the home page or wherever you want
        res.redirect("/home");
    } catch (error) {
        // If there is an error, handle it
        console.error("Error adding Resident:", error.message);
        // Redirect to an error page or handle the error in another way
        res.redirect("/error");
    }
});

app.get("/visitor_sign_up", (req, res) => {
    res.render("visitor_sign_up")
})

app.post("/visitor_sign_up", async (req, res) => {
    const { name, phone_number, vehicle_number, entry, tenure_hours } = req.body;

    try {
        // Create a new Resident instance with form data
        const newResident = new Resident({
            name: name,
            phone_number: phone_number,
            vehicle_number: vehicle_number,
            entry: entry,
            tenure_hours: tenure_hours
        });

        // Save the newResident to the database
        const savedVisitor = await newVisitor.save();

        console.log("New Resident added:", savedVisitor);

        // Redirect to the home page or wherever you want
        res.redirect("/home");
    } catch (error) {
        // If there is an error, handle it
        console.error("Error adding Resident:", error.message);
        // Redirect to an error page or handle the error in another way
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