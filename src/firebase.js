import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyA0iadkuVneh9TfcEB5W6JrAkehYpjapWM",
  authDomain: "react-app-cb74f.firebaseapp.com",
  databaseURL: "https://react-app-cb74f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "react-app-cb74f",
  storageBucket: "react-app-cb74f.firebasestorage.app",
  messagingSenderId: "1046354398420",
  appId: "1:1046354398420:web:36471250c19b480169ff41",
  measurementId: "G-55KYW257L7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);