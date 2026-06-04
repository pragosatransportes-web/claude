import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA7DghMxDb_FapPu9N8sn0SlCi3oSy9yUA",
  authDomain: "frota-pragosa.firebaseapp.com",
  databaseURL: "https://frota-pragosa-default-rtdb.firebaseio.com",
  projectId: "frota-pragosa",
  storageBucket: "frota-pragosa.firebasestorage.app",
  messagingSenderId: "509835490143",
  appId: "1:509835490143:web:839c041563a5007cffbcea"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
