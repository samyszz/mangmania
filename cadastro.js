import { auth } from './firebase-init.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

document.querySelector('#signup').addEventListener('click', (e) => {
  e.preventDefault();
  const nome = document.querySelector('input[name="usuario"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const senha = document.querySelector('input[name="senha"]').value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      return updateProfile(userCredential.user, { displayName: nome });
      
    })
    .then(() => {
      alert("Conta criada com sucesso!");
      window.location.href = "./telainicial.html";
    })
    .catch((error) => {
      alert("Erro no cadastro: " + error.message);
    });
});
