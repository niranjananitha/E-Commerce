import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// User's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfoKYyBvwnVSPDMJxLqmqWzOVFWAALY_4",
  authDomain: "login-578b2.firebaseapp.com",
  projectId: "login-578b2",
  storageBucket: "login-578b2.firebasestorage.app",
  messagingSenderId: "1038130319928",
  appId: "1:1038130319928:web:1a8b81b3fe6ba488a64ccd",
  measurementId: "G-E6QTVVEMGX",
  databaseURL: "https://login-578b2-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
