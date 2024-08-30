// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { getDatabase } = require("firebase-admin/database");
const { getStorage } = require("firebase-admin/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAylpn_KS0QugCUnoPu5195s-nWz1CbrKs",
    authDomain: "boxproduct-ba126.firebaseapp.com",
    projectId: "boxproduct-ba126",
    storageBucket: "boxproduct-ba126.appspot.com",
    messagingSenderId: "293660540157",
    appId: "1:293660540157:web:0dea29f634285c8736d294",
    measurementId: "G-G92P56SPTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

module.exports.db = getDatabase(app);
module.exports.storage = getStorage(app);
module.exports.analytics = analytics;