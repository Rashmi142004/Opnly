// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFkkb9o6g6OemrC-u-J8evYxyw28jXL2c",
  authDomain: "opnly-51278.firebaseapp.com",
  projectId: "opnly-51278",
  storageBucket: "opnly-51278.firebasestorage.app",
  messagingSenderId: "873910279900",
  appId: "1:873910279900:web:100c4d18facfb5f8599e19",
  measurementId: "G-935S0RJRPQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

