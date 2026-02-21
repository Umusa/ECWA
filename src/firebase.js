// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIkV4YKZSxdlXn0gndHGhFmzPySRifygs",
  authDomain: "ecwa-church-reg.firebaseapp.com",
  projectId: "ecwa-church-reg",
  storageBucket: "ecwa-church-reg.firebasestorage.app",
  messagingSenderId: "491408218674",
  appId: "1:491408218674:web:839273d7e789a86c2d7a2b",
  measurementId: "G-HH6QY82HPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Export for use in components
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
