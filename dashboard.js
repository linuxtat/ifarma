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

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeREJBh-U0sR8MhMIThRXCOkx1eXVXWCs",
  authDomain: "test-6700c.firebaseapp.com",
  projectId: "test-6700c",
  storageBucket: "test-6700c.appspot.com",
  messagingSenderId: "1038779488637",
  appId: "1:1038779488637:web:4a9c7cfeaaadeb07699414"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let currentUser = null;

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitInvestment");
const investmentList = document.getElementById("investmentList");
const logoutBtn = document.getElementById("logoutBtn");

const uploadBtn = document.getElementById("uploadBtn");
const imageUpload = document.getElementById("imageUpload");
const fileList = document.getElementById("fileList");

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadInvestments(user.uid);
    loadUserFiles(user.uid);
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

uploadBtn.onclick = async () => {
  const file = imageUpload.files[0];
  if (!file || !currentUser) return alert("ছবি সিলেক্ট করুন");

  const storageRef = ref(storage, `users/${currentUser.uid}/images/${file.name}`);
  await uploadBytes(storageRef, file);
  alert("✅ ছবি আপলোড হয়েছে!");
  loadUserFiles(currentUser.uid);
};

async function loadUserFiles(uid) {
  const folderRef = ref(storage, `users/${uid}/images`);
  const result = await listAll(folderRef);
  fileList.innerHTML = "";
  for (const item of result.items) {
    const url = await getDownloadURL(item);
    fileList.innerHTML += `<div style="margin-bottom:10px;">
      <img src="${url}" alt="Uploaded Image" width="150"/><br/>
      <a href="${url}" target="_blank">🔗 View Full</a>
    </div>`;
  }
}

logoutBtn.onclick = () => {
  signOut(auth).then(() => {
    alert("Logged out.");
    window.location.href = "index.html";
  });
};
