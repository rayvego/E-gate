const express = require("express");
const app = express();

const path = require("path");
const methodOverride = require("method-override");

const mongoose = require("mongoose");
const Resident = require("./models/residents");
const Visitor = require("./models/visitor");
const { scheduledJob } = require("./checkVisitors");

const passport = require("passport");
const initializePassport = require("./passport-config");
const session = require("express-session");

const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const crypto = require("crypto"); // Built-in Node.js module for generating random bytes

const qr = require("qrcode");

app.use(
  session({
    secret: "abcdef",
    resave: false,
    saveUninitialized: true,
  }),
);

const flash = require("connect-flash");

app.use(flash());

initializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other email service
  auth: {
    user: "23110208@iitgn.ac.in",
    pass: "Absent_Minded_Genius0",
  },
});

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log("Connection Failed");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

async function generateMasterPasswordHash(plainTextPassword) {
  const saltRounds = 10; // Recommended number of salt rounds
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
}

let storedMasterPasswordHash;
async function storeMasterPasswordHash() {
  const myMasterPassword = "letmein"; // Replace with your actual password
  storedMasterPasswordHash = await generateMasterPasswordHash(myMasterPassword);
  console.log(storedMasterPasswordHash); // Now you can access the hash
}

storeMasterPasswordHash();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

function checkAdminAuthentication(req, res, next) {
  if (req.session.adminAuthenticated) {
    next();
  } else {
    res.redirect("/admin-login");
  }
}

app.get("/stop-job", (req, res) => {
  if (scheduledJob) {
    scheduledJob.stop();
    console.log("Scheduled job stopped");
    res.send("Scheduled job stopped");
  } else {
    res.send("No scheduled job running");
  }
});

// Inside your index.js file...

app.get("/residents", checkAdminAuthentication, async (req, res) => {
  try {
    const residents = await Resident.find();
    res.render("residentsList", { residents });
  } catch (error) {
    console.error("Error fetching residents:", error.message);
    res.status(500).send("Error fetching residents");
  }
});

app.get("/visitors", checkAdminAuthentication, async (req, res) => {
  // Similar implementation for fetching visitors from the 'Visitor' model
  try {
    const visitors = await Visitor.find();
    res.render("visitorsList", { visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error.message);
    res.status(500).send("Error fetching visitors");
  }
});

app.get("/all-entries", checkAdminAuthentication, async (req, res) => {
  try {
    const residents = await Resident.find();
    const visitors = await Visitor.find();
    res.render("allEntriesList", { residents, visitors });
  } catch (error) {
    console.error("Error fetching all entries:", error.message);
    res.status(500).send("Error fetching all entries");
  }
});

// figure out all
app.get("/admin-area", checkAdminAuthentication, async (req, res) => {
  try {
    // Fetch residents from the database
    const residents = await Resident.find();
    // Render the infoList template with the fetched residents
    res.render("infoList", { residents });
  } catch (error) {
    console.error("Error fetching residents:", error.message);
    res.status(500).send("Error fetching residents");
  }
});

app.get("/admin-login", (req, res) => {
  res.render("admin_login");
});
app.post("/admin-login", async (req, res) => {
  const { password } = req.body;

  const isMatch = await bcrypt.compare(password, storedMasterPasswordHash);

  if (isMatch) {
    req.session.adminAuthenticated = true;
    res.redirect("/admin-area");
  } else {
    res.render("admin_login", { error: "Invalid password" });
  }
});

app.get("/resident_sign_up", (req, res) => {
  res.render("resident_sign_up");
});

app.get("/scanner", async (req, res) => {
  try {
    res.render("scanner.ejs");
  } catch (error) {
    console.error("Error fetching residents:", error.message);
    res.status(500).send("Error fetching residents");
  }
});

app.post("/resident_sign_up", async (req, res) => {
  const { email, password, name, pnumber, identification_code } = req.body;

  try {
    // Check if the email already exists
    const existingResident = await Resident.findOne({ email_id: email });
    if (existingResident) {
      return res.status(400).send("Email already exists");
    }

    // Generate a random 6-digit OTP
    const otp = crypto.randomBytes(3).toString("hex");
    console.log(otp);

    // Send the OTP via email
    const mailOptions = {
      from: "23110208@iitgn.ac.in",
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP for email verification is: ${otp}`,
    };

    // Use await here
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    // Render a view or display a prompt for the user to enter the OTP
    res.render("enterOTP", {
      email,
      otp,
      password,
      name,
      pnumber,
      identification_code,
    });
  } catch (error) {
    console.error("Error adding Resident:", error.message);
    res.redirect("/");
  }
});

app.post("/verifyOTP", async (req, res) => {
  const {
    email,
    otp,
    password,
    name,
    pnumber,
    identification_code,
    otp_user_entered,
  } = req.body;
  console.log(otp, otp_user_entered);
  try {
    // Check if the OTP is valid
    if (otp_user_entered !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Resident instance with form data
    const newResident = new Resident({
      name,
      password: hashedPassword,
      phone_number: pnumber,
      email_id: email,
      identification_code: identification_code,
    });

    // Save the newResident to the database
    const savedResident = await newResident.save();
    console.log("New Resident added:", savedResident);

    // Generate the QR code containing the phone number
    const qrDataURL = await qr.toDataURL(pnumber);
    // Save the QR code image data to MongoDB linked to the resident document
    savedResident.qr = qrDataURL;
    await savedResident.save();

    // Redirect to the login page or wherever you want
    res.redirect("/login");
  } catch (error) {
    console.error("Error adding Resident:", error.message);
    res.redirect("/");
  }
});

app.post("/scan-qr-code", async (req, res) => {
  const { qrCodeData } = req.body;

  try {
    const resident = await Resident.findOne({ phone_number: qrCodeData });
    if (!resident) {
      const visitor = await Visitor.findOne({ phone_number: qrCodeData });
      if (!visitor) {
        return res.status(400).send("Invalid QR code or user not found");
      }
      visitor.scanCount++;
      // If the scanCount is 2 (scanned for the second time), mark the visitor as expired
      if (visitor.scanCount === 2) {
        visitor.isExpired = true;
      }
      await visitor.save();

      return res.render("userDetails", { user: visitor, userType: "visitor" });
    }
    return res.render("userDetails", { user: resident, userType: "resident" });
  } catch (error) {
    console.error("Error finding user:", error.message);
    res.status(500).send("Error finding user");
  }
});

app.post("/approve-user", async (req, res) => {
  const { userType, userId, action } = req.body;

  try {
    if (action === "approve") {
      // Handle user approval
      // You can add any additional logic here, like updating a field in the database
      console.log("User approved");
    } else if (action === "reject") {
      // Handle user rejection
      if (userType === "resident") {
        await Resident.findOneAndDelete({ email_id: userId });
      } else {
        await Visitor.findOneAndDelete({ phone_number: userId });
      }
      console.log("User rejected and data removed from the database");
    }
    res.redirect("/scanner"); // Redirect to the scanner page or any other desired page
  } catch (error) {
    console.error("Error approving/rejecting user:", error.message);
    res.status(500).send("Error approving/rejecting user");
  }
});

app.get("/visitor_sign_up", (req, res) => {
  res.render("visitor_sign_up");
});

app.post("/visitor_sign_up", async (req, res) => {
  const {
    name,
    phone_number,
    vehicle_number,
    entryDate,
    tenure_hours,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new Resident instance with form data
    const newVisitor = new Visitor({
      name: name,
      phone_number: phone_number,
      vehicle_number: vehicle_number,
      entry: entryDate,
      tenure_hours: tenure_hours,
      password: hashedPassword,
    });

    // Save the newResident to the database
    const savedVisitor = await newVisitor.save();
    console.log("New Visitor added:", savedVisitor);

    const qrDataURL = await qr.toDataURL(phone_number);
    savedVisitor.qr = qrDataURL;
    await savedVisitor.save();

    // Redirect to the home page or wherever you want
    res.redirect("/visitor-login");
  } catch (error) {
    // If there is an error, handle it
    console.error("Error adding Visitor:", error.message);
    // Redirect to an error page or handle the error in another way
    res.redirect("/");
  }
});

app.get("/login", (req, res) => {
  res.render("login"); // Assuming one shared login form
});

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  passport.authenticate("resident-local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login", // or a separate visitor login page
    failureFlash: true,
  })(req, res, next);
});

app.get("/visitor-login", (req, res) => {
  res.render("login_v"); // Assuming one shared login form
});

app.post("/visitor-login", (req, res, next) => {
  const { phone_number, password } = req.body;

  passport.authenticate("visitor-local", {
    successRedirect: "/visitor-dashboard",
    failureRedirect: "/visitor-login", // or a separate visitor login page
    failureFlash: true,
  })(req, res, next);
});

app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { resident: req.user, qrBase64: req.user.qr });
});

app.get("/visitor-dashboard", ensureAuthenticated, (req, res) => {
  // Naming suggestion
  res.render("dashboard_visitor", { visitor: req.user, qrBase: req.user.qr });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use((req, res) => {
  console.log("Got a request!");
  res.send("This is a response");
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
