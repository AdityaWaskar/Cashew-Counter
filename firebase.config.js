// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const apiKey = import.meta.env.VITE_APIKEY;
const authDomain = import.meta.env.VITE_authDomain;
const projectId = import.meta.env.VITE_projectId;
const torageBucket = import.meta.env.VITE_torageBucket;
const essagingSenderId = import.meta.env.VITE_essagingSenderId;
const ppId = import.meta.env.VITE_ppId;
const measurementId = import.meta.env.VITE_measurementId;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: torageBucket,
  messagingSenderId: essagingSenderId,
  appId: ppId,
  measurementId: measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const firestore = getFirestore(app);
