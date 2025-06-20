// Firebase Import ও কনফিগ
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeREJBh-U0sR8MhMIThRXCOkx1eXVXWCs",
  authDomain: "test-6700c.firebaseapp.com",
  projectId: "test-6700c",
  storageBucket: "test-6700c.firebasestorage.app",
  messagingSenderId: "1038779488637",
  appId: "1:1038779488637:web:4a9c7cfeaaadeb07699414",
  measurementId: "G-BZWPDKZV0G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Modal Control
const modal = document.getElementById("loginModal");
document.getElementById("loginBtn").onclick = () => modal.style.display = "flex";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";

// Helper function: admin বা user আলাদা রিডাইরেকশন
const redirectUser = (email) => {
  if (email.startsWith("admin13")) {
    window.location.href = "admin.html";
  } else {
    window.location.href = "dashboard.html";
  }
};

// Sign Up
document.getElementById("signup").onclick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(userCred => {
      alert("Account created successfully!");
      redirectUser(userCred.user.email);
    })
    .catch(err => alert("Error: " + err.message));
};

// Sign In
document.getElementById("signin").onclick = () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(userCred => {
      alert("Logged in successfully!");
      redirectUser(userCred.user.email);
    })
    .catch(err => alert("Error: " + err.message));
};
