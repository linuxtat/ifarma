import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
const db = getFirestore(app);

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitInvestment");
const investmentList = document.getElementById("investmentList");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadInvestments(user.uid);
  } else {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

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
    profitPercent: 0,
    status: "pending"
  });

  alert("Investment submitted!");
  amountInput.value = "";
  dateInput.value = "";
  loadInvestments(currentUser.uid);
};

async function loadInvestments(userId) {
  investmentList.innerHTML = "";
  const q = query(collection(db, "investments"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const data = doc.data();
    const profit = data.amount * (data.profitPercent || 0) / 100;
    investmentList.innerHTML += `<li>
      📅 ${data.date} — 💰 ৳${data.amount} — লাভ: ৳${profit.toFixed(2)} (${data.profitPercent || 0}%)
      — <strong>Status: ${data.status || "pending"}</strong>
    </li>`;
  });
}

logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    alert("Logged out.");
    window.location.href = "index.html";
  });
};
