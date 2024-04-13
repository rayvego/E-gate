const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signUpWithEmailAndPassword = async (email, password) => {
    try {
        // Create user with email and password
        await createUserWithEmailAndPassword(auth, email, password);
        // If successful, you can optionally do something here like redirecting the user
        console.log("User signed up successfully!");
        return { success: true };
    } catch (error) {
        // Handle errors
        console.error("Error signing up:", error.message);
        return { success: false, errorMessage: error.message };
    }
};

// Function to handle user sign-in
const signInWithEmailAndPassword = async (email, password) => {
    try {
        // Sign in user with email and password
        await signInWithEmailAndPassword(auth, email, password);
        // If successful, you can optionally do something here like redirecting the user
        console.log("User signed in successfully!");
        return { success: true };
    } catch (error) {
        // Handle errors
        console.error("Error signing in:", error.message);
        return { success: false, errorMessage: error.message };
    }
};

module.exports = { signUpWithEmailAndPassword, signInWithEmailAndPassword };