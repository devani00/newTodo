// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBPWEUk5YU5x2l_fUGV_yANjd6kqi7W0sU",
  authDomain: "todoapp-15135.firebaseapp.com",
  projectId: "todoapp-15135",
  storageBucket: "todoapp-15135.appspot.com",
  messagingSenderId: "492899077955",
  appId: "1:492899077955:web:1f52af891b27f1d6aea9f6",
  measurementId: "G-RVE1K13J9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up Firebase Authentication and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore

// Export authentication, provider, and database
export { auth, provider, signInWithPopup, db }; // Include db in exports
