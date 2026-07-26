import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Pega aquí tu configuración
const firebaseConfig = {
  apiKey: "AIzaSyAD085DCIUcxkPvt3oGHfHPgbW2B30ZFh0",
  authDomain: "congregacion-18f0d.firebaseapp.com",
  projectId: "congregacion-18f0d",
  storageBucket: "congregacion-18f0d.firebasestorage.app",
  messagingSenderId: "557209482613",
  appId: "1:557209482613:web:cae1527b2d94b8412f8f3c",
  measurementId: "G-QJY5GQRP4Z"
};

const app = initializeApp(firebaseConfig);

// Base de datos
export const db = getFirestore(app);

// Storage (para las imágenes)
export const storage = getStorage(app);

export default app;