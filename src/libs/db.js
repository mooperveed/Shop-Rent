import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjZbOY7wdOc58l7Mdeyil9aIhanmm8vVo",
  authDomain: "shop-rent-36261.firebaseapp.com",
  projectId: "shop-rent-36261",
  storageBucket: "shop-rent-36261.firebasestorage.app",
  messagingSenderId: "259093832147",
  appId: "1:259093832147:web:662d368d3fbf14a7d18f26",
  measurementId: "G-MMQNV35FCY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

