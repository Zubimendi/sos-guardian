// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2hveLxuBEi8Hcimn1SG_jFQqhofcDwNI",
  authDomain: "sos-guardian-6b650.firebaseapp.com",
  databaseURL: "https://sos-guardian-6b650-default-rtdb.firebaseio.com",
  projectId: "sos-guardian-6b650",
  storageBucket: "sos-guardian-6b650.firebasestorage.app",
  messagingSenderId: "123367672862",
  appId: "1:123367672862:web:7c211dbb0eca1cdfcdf20f",
  measurementId: "G-DJG6Z9011Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);