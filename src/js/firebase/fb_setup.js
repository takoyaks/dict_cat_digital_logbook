// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getFirestore, initializeFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTmG7AjupmfqVrkq5v3ra7fFnIaSBCyEo",
  authDomain: "dictr5cat.firebaseapp.com",
  projectId: "dictr5cat",
  storageBucket: "dictr5cat.firebasestorage.app",
  messagingSenderId: "908344692257",
  appId: "1:908344692257:web:2e29cce05e515339685d60",
  measurementId: "G-1G72PM2C82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore with offline persistence
const db = initializeFirestore(app, {
  cache: "persistent"
});

export { db };