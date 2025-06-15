// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJVOrQOqvGkuaMLlPUWzaFndA0kn120cI",
  authDomain: "mangamania-essevai.firebaseapp.com",
  projectId: "mangamania-essevai",
  storageBucket: "mangamania-essevai.firebasestorage.app",
  messagingSenderId: "39272425315",
  appId: "1:39272425315:web:fb48d79a44ad5613059556",
  measurementId: "G-P7QGNHZPS8",
};

// Inicializa o Firebase e exporta a autenticação
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
