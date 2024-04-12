const express = require("express")
const app = express()
const path = require("path")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.listen(5000, () => {
    console.log("Listening on port 5000")
})

app.get("/", (req, res) => {
    res.render("home")
})
app.use((req, res) => {
    console.log("Got a request!")
    res.send("This is a response")
})