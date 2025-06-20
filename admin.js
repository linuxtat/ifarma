import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
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

const investmentList = document.getElementById("investmentList");

onAuthStateChanged(auth, async user => {
  if (!user || !user.email.startsWith("admin13")) {
    alert("Access denied. Admins only.");
    window.location.href = "index.html";
    return;
  }

  const snapshot = await getDocs(collection(db, "investments"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.style.marginBottom = "10px";

    div.innerHTML = `
      📅 ${data.date} — 💰 ৳${data.amount} <br/>
      লাভ: <input type="number" id="profit-${docSnap.id}" value="${data.profitPercent || 0}" style="width: 60px;" />%
      <button onclick="updateProfit('${docSnap.id}')">Update</button>
      <hr/>
    `;
    investmentList.appendChild(div);
  });
});

window.updateProfit = async (id) => {
  const input = document.getElementById(`profit-${id}`);
  const percent = parseFloat(input.value);
  const ref = doc(db, "investments", id);
  await updateDoc(ref, { profitPercent: percent });
  alert("Updated profit %!");
};
