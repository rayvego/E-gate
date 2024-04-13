const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Resident = require('./models/residents');

const initializePassport = (passport) => {
    const authenticateUser = async (email, password, done) => {
        // Find the user by email
        const resident = await Resident.findOne({ email_id: email });

        if (!resident) {
            return done(null, false, { message: 'No resident with that email' });
        }

        try {
            // Compare the provided password with the hashed password
            if (await bcrypt.compare(password, resident.password)) {
                return done(null, resident);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((resident, done) => done(null, resident.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const resident = await Resident.findById(id);
            return done(null, resident);
        } catch (error) {
            return done(error);
        }
    });
};

module.exports = initializePassport;