const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Resident = require('./models/residents');
const Visitor = require('./models/visitor');

const initializePassport = (passport) => {
    const authenticateResident = async (email, password, done) => {
        // Find the resident by email
        const resident = await Resident.findOne({ email_id: email });

        if (!resident) {
            console.log('No resident with that email');
            return done(null, false, { message: 'No resident with that email' });
        }

        try {
            // Compare the provided password with the hashed password
            if (await bcrypt.compare(password, resident.password)) {
                console.log('Resident authenticated:', resident);
                return done(null, resident);
            } else {
                console.log('Password incorrect');
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            console.log('Error comparing passwords:', error);
            return done(error);
        }
    };

    const authenticateVisitor = async (phone_number, password, done) => {
        // Find the visitor by phone number
        const visitor = await Visitor.findOne({ phone_number });

        if (!visitor) {
            console.log('No visitor with that phone number');
            return done(null, false, { message: 'Invalid phone number' });
        }

        try {
            // Compare the provided password with the hashed password
            if (await bcrypt.compare(password, visitor.password)) {
                console.log('Visitor authenticated:', visitor);
                return done(null, visitor);
            } else {
                console.log('Password incorrect');
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            console.log('Error comparing passwords:', error);
            return done(error);
        }
    };

    passport.use("resident-local", new LocalStrategy({ usernameField: 'email' }, authenticateResident));
    passport.use("visitor-local", new LocalStrategy({ usernameField: 'phone_number' }, authenticateVisitor));

    // Serialization
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialization
    passport.deserializeUser(async (id, done) => {
        try {
            // Check if the user is a resident or a visitor
            const resident = await Resident.findById(id);
            if (resident) {
                return done(null, resident);
            }

            const visitor = await Visitor.findById(id);
            if (visitor) {
                return done(null, visitor);
            }

            return done(null, false);
        } catch (error) {
            return done(error);
        }
    });
};

module.exports = initializePassport;