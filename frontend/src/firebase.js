// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8jnUE_UOf392gJgQlfLI-20psmaGmRew",
  authDomain: "shadowdine.firebaseapp.com",
  projectId: "shadowdine",
  storageBucket: "shadowdine.firebasestorage.app",
  messagingSenderId: "618443224799",
  appId: "1:618443224799:web:d6c78e20d8dce732781b6a",
  measurementId: "G-WTP2HE1ZLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };