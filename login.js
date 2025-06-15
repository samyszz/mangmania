import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.querySelector("#signin").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.querySelector('input[name="usuarioEmail"]').value;
  const senha = document.querySelector('input[name="senha"]').value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
       window.location.href = "./telainicial.html";
    })
    .catch((error) => {
      alert("Erro ao fazer login: " + error.message);
    });
});
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Botão de login com Google
document.querySelector('#login-google').addEventListener('click', (e) => {
  e.preventDefault();

  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      // Redireciona pra página inicial
      window.location.href = "telainicial.html";
    })
    .catch((error) => {
      console.error("Erro ao fazer login com Google:", error);
      alert("Erro ao fazer login com Google: " + error.message);
    });
});

