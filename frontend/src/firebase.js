import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC8jnUE_UOf392gJgQlfLI-20psmaGmRew",
  authDomain: "shadowdine.firebaseapp.com",
  projectId: "shadowdine",
  storageBucket: "shadowdine.firebasestorage.app",
  messagingSenderId: "618443224799",
  appId: "1:618443224799:web:d6c78e20d8dce732781b6a",
  measurementId: "G-WTP2HE1ZLK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
export default app;