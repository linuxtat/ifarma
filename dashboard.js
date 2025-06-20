import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
const db = getFirestore(app);

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitInvestment");
const investmentList = document.getElementById("investmentList");

let currentUser = null;

// ইউজার লগইন চেক
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadInvestments(user.uid);
  } else {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

// ইনভেস্টমেন্ট সাবমিশন
submitBtn.onclick = async () => {
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  if (!amount || !date) {
    alert("Please enter both amount and date.");
    return;
  }

  await addDoc(collection(db, "investments"), {
    userId: currentUser.uid,
    amount,
    date,
    profitPercent: 0, // শুরুতে 0%, অ্যাডমিন পরে সেট করবে
  });

  alert("Investment submitted!");
  amountInput.value = "";
  dateInput.value = "";
  loadInvestments(currentUser.uid);
};

// ইউজারের ইনভেস্টমেন্ট লোড করা
async function loadInvestments(userId) {
  investmentList.innerHTML = "";
  const q = query(collection(db, "investments"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    const profit = data.amount * (data.profitPercent || 0) / 100;
    investmentList.innerHTML += `<li>
      📅 ${data.date} — 💰 ৳${data.amount} — লাভ: ৳${profit.toFixed(2)} (${data.profitPercent || 0}%)
    </li>`;
  });
}
