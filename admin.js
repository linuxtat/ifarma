import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
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

const investmentList = document.getElementById("investmentList");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async user => {
  if (!user || !user.email.startsWith("admin13")) {
    alert("Access denied. Admins only.");
    window.location.href = "index.html";
    return;
  }
  await loadInvestments();
});

async function loadInvestments() {
  const snapshot = await getDocs(collection(db, "investments"));
  investmentList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;
    const div = document.createElement("div");
    div.style.marginBottom = "10px";

    div.innerHTML = `
      📅 ${data.date} — 💰 ৳${data.amount} — ইউজার: ${data.userId}<br/>
      লাভ: <input type="number" id="profit-${id}" value="${data.profitPercent || 0}" style="width: 60px;" />%
      <button onclick="updateProfit('${id}')">Update</button>
      ${data.status !== "approved"
        ? `<button onclick="approveInvestment('${id}')">Approve</button>`
        : `<span>✅ Approved</span>`
      }
      <button onclick="deleteInvestment('${id}')">Delete</button>
      <hr/>
    `;
    investmentList.appendChild(div);
  });
}

window.updateProfit = async (id) => {
  const input = document.getElementById(`profit-${id}`);
  const percent = parseFloat(input.value);
  const ref = doc(db, "investments", id);
  await updateDoc(ref, { profitPercent: percent });
  alert("Updated profit %!");
  await loadInvestments();
};

window.approveInvestment = async (id) => {
  const ref = doc(db, "investments", id);
  await updateDoc(ref, { status: "approved" });
  alert("Investment approved!");
  await loadInvestments();
};

window.deleteInvestment = async (id) => {
  if (confirm("Are you sure to delete this investment?")) {
    await deleteDoc(doc(db, "investments", id));
    alert("Investment deleted!");
    await loadInvestments();
  }
};

logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    alert("Logged out.");
    window.location.href = "index.html";
  });
};
