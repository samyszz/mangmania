document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const iconElement = darkModeToggle.querySelector("i"); // Seleciona o elemento <i> dentro do botão

  // Função para aplicar o tema e atualizar o ícone
  const applyTheme = (isDarkMode) => {
    // Adiciona ou remove a classe 'dark-mode' do body
    body.classList.toggle("dark-mode", isDarkMode);

    // Remove as duas classes de ícone para garantir um estado limpo
    iconElement.classList.remove("fa-sun", "fa-moon");

    // Adiciona o ícone correto baseado no modo atual
    if (isDarkMode) {
      // Se estamos no modo escuro, o ícone deve ser a LUA
      iconElement.classList.add("fa-moon");
    } else {
      // Se estamos no modo claro, o ícone deve ser o SOL
      iconElement.classList.add("fa-sun");
    }
  };

  // Tentar carregar a preferência do usuário do localStorage
  const savedDarkMode = localStorage.getItem("darkMode");

  // Ao carregar a página, aplicar o tema salvo
  if (savedDarkMode === "enabled") {
    applyTheme(true); // Se estava no modo escuro, aplica e mostra a lua
  } else {
    // Se não há preferência ou modo claro estava salvo, inicia com o modo claro e mostra o sol
    applyTheme(false);
  }

  // Adicionar o event listener para o clique no botão
  darkModeToggle.addEventListener("click", () => {
    // Obtém o estado atual, inverte e aplica o novo tema
    let isDarkMode = body.classList.contains("dark-mode");
    isDarkMode = !isDarkMode; // Inverte o estado
    applyTheme(isDarkMode); // Aplica o novo tema e atualiza o ícone

    // Salvar a preferência do usuário no localStorage
    if (isDarkMode) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });
});
