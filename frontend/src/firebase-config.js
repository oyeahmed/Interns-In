// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByhxz1wYGP-1fUZ0v2T45q0vPHfW_LLpY",
  authDomain: "interns-in-f1f1e.firebaseapp.com",
  projectId: "interns-in-f1f1e",
  storageBucket: "interns-in-f1f1e.appspot.com",
  messagingSenderId: "850988262906",
  appId: "1:850988262906:web:39c68b09413369188a3043",
  measurementId: "G-5BE8S16SYQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// collection references

// get collection data
