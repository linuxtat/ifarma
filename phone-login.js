import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
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

let confirmationResult;

// Setup invisible reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible',
  callback: (response) => {
    // reCAPTCHA solved
  }
});

document.getElementById("sendOtpBtn").onclick = async () => {
  const phoneNumber = document.getElementById("phoneNumber").value;
  if (!phoneNumber.startsWith("+880") || phoneNumber.length < 13) {
    alert("সঠিক বাংলাদেশি নাম্বার দিন (+8801...)");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    alert("OTP পাঠানো হয়েছে। এখন কোড লিখুন।");
  } catch (error) {
    console.error("OTP পাঠাতে সমস্যা:", error);
    alert("OTP পাঠানো ব্যর্থ হয়েছে।");
  }
};

document.getElementById("verifyOtpBtn").onclick = async () => {
  const otp = document.getElementById("otpCode").value;
  if (!otp || otp.length < 6) {
    alert("সঠিক OTP দিন");
    return;
  }

  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    alert("লগইন সফল! ইউজার UID: " + user.uid);
    // এখানে redirect বা session তৈরি করা যাবে
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("OTP যাচাই ব্যর্থ:", error);
    alert("ভুল OTP!");
  }
};
