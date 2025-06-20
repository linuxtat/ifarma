// Firebase Config (Demo Project)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ✅ ডেমো প্রজেক্ট (public config - শুধু টেস্টের জন্য)
const firebaseConfig = {
  apiKey: "AIzaSyA37xX-pV1D_t3chvzZ7l8ov3EeFQzqR2A",
  authDomain: "demo-ifarmer.firebaseapp.com",
  projectId: "demo-ifarmer",
  storageBucket: "demo-ifarmer.appspot.com",
  messagingSenderId: "999999999999",
  appId: "1:999999999999:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Modal Control
const modal = document.getElementById("loginModal");
document.getElementById("loginBtn").onclick = () => modal.style.display = "flex";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";

// Sign Up
document.getElementById("signup").onclick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert("Error: " + err.message));
};

// Sign In
document.getElementById("signin").onclick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      alert("Logged in successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert("Error: " + err.message));
};
