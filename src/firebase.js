import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDxSoZCjQ97cL7m90ELro-GGlV_7-sbfcY",
  authDomain: "kindergarten-app-3cb93.firebaseapp.com",
  projectId: "kindergarten-app-3cb93",
  storageBucket: "kindergarten-app-3cb93.firebasestorage.app",
  messagingSenderId: "486159668986",
  appId: "1:486159668986:web:29ebf04d6d02e430d41b43",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
