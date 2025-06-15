//--my aqui eu carrosel rodar com setas e autoatico --
const cardsContainer = document.getElementById("cards-container");
const btnPrev = document.getElementById("prevBtn1");
const btnNext = document.getElementById("nextBtn1");

let currentIndex = 0;

async function fetchMangasFromAPI() {
  try {
    const res = await fetch(
      "https://api.mangadex.org/manga?limit=10&availableTranslatedLanguage[]=pt-br&order[updatedAt]=desc&includes[]=cover_art"
    );
    const data = await res.json();
    const mangas = data.data;

    cardsContainer.innerHTML = ""; // Limpa os cards fixos

    for (const manga of mangas) {
      if (
        manga.attributes.contentRating === "erotica" ||
        manga.attributes.contentRating === "pornographic"
      ) {
        continue;
      }

      const title =
        manga.attributes.title["pt-br"] ||
        manga.attributes.title["en"] ||
        "Sem título";
      const mangaId = manga.id;

      const coverRel = manga.relationships.find(
        (rel) => rel.type === "cover_art"
      );
      const fileName = coverRel?.attributes?.fileName;
      if (!fileName) continue;

      const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;

      const article = document.createElement("article");
      article.classList.add("card");
      article.setAttribute("data-manga-id", mangaId);
      article.innerHTML = `
        <img alt="${title}" class="card-img" src="${imageUrl}" />
        <div class="card-buttons">
            <button class="info-btn">
                <i class="fas fa-info-circle"></i> <span>Saiba mais</span>
            </button>
            <button class="read-btn" onclick="window.open('https://mangadex.org/title/${mangaId}', '_blank')">
                <i class="fas fa-cat"></i> <span>Leia agora</span>
            </button>
        </div>
      `;

      cardsContainer.appendChild(article);
    }
  } catch (err) {
    console.error("Erro ao buscar mangás para o carrossel:", err);
  }
}

function moveCarousel(direction) {
  const cards = document.querySelectorAll(".card");
  const cardWidth = cards[0]?.offsetWidth || 250;
  currentIndex += direction;
  currentIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
  cardsContainer.scrollTo({
    left: currentIndex * (cardWidth + 20),
    behavior: "smooth"
  });
}

btnPrev.addEventListener("click", () => moveCarousel(-1));
btnNext.addEventListener("click", () => moveCarousel(1));

// aqui botao para voltar para cima
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// --- Código para upload de imagem (deixado como estava) ---
const cadastroImageInput = document.getElementById('cadastro-image-input');
const cadastroImage = document.getElementById('cadastro-image');
if (cadastroImageInput && cadastroImage) {
  cadastroImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      cadastroImage.src = URL.createObjectURL(file);
    }
  });
}
const loginImageInput = document.getElementById('login-image-input');
const loginImage = document.getElementById('login-image');
if (loginImageInput && loginImage) {
  loginImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      loginImage.src = URL.createObjectURL(file);
    }
  });
}


// --- Lógica do Menu Responsivo ---
const hamburgerMenu = document.getElementById('hamburger-menu');
const mainNav = document.getElementById('main-nav');
if (hamburgerMenu && mainNav) {
  hamburgerMenu.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerMenu.querySelector('i').classList.toggle('fa-bars');
    hamburgerMenu.querySelector('i').classList.toggle('fa-times');
  });

  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      hamburgerMenu.querySelector('i').classList.remove('fa-times');
      hamburgerMenu.querySelector('i').classList.add('fa-bars');
    });
  });

  document.addEventListener('click', (event) => {
    if (!mainNav.contains(event.target) && !hamburgerMenu.contains(event.target) && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      hamburgerMenu.querySelector('i').classList.remove('fa-times');
      hamburgerMenu.querySelector('i').classList.add('fa-bars');
    }
  });
}

/// --- MangaDex API Integration ---
const BASE_URL = 'https://api.mangadex.org';
const MANGA_LIMIT = 10;
let currentPage = 1;
let currentSearchQuery = '';
let currentFilters = [];

const mangaGrid = document.getElementById('manga-grid');
const paginationControls = document.getElementById('pagination-controls');
const searchInput = document.getElementById('manga-search-input');
const searchButton = document.querySelector('.search-button');

const toggleFiltroBtn = document.getElementById('toggleFiltro');
const filtroDropdown = document.getElementById('filtroDropdown');
// <-- CORREÇÃO: Pegamos a referência do botão "Aplicar" que já existe no HTML.
const aplicarFiltroBtn = document.getElementById('aplicarFiltro');

let availableGenres = [];

async function fetchGenres() {
  try {
    const response = await fetch(`${BASE_URL}/manga/tag`);
    const data = await response.json();
    if (data && data.data) {
      return data.data.filter(tag => tag.attributes.group === 'genre');
    }
    return [];
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
}

// <-- CORREÇÃO: Função ajustada para popular apenas os checkboxes.
async function populateGenreFilters() {
  availableGenres = await fetchGenres();
  const checkboxContainer = document.getElementById('checkboxContainer');
  
  if (!checkboxContainer) return;
  checkboxContainer.innerHTML = ''; // Limpa apenas a área dos checkboxes

  availableGenres.forEach(genre => {
    const genreName = genre.attributes.name.en || Object.values(genre.attributes.name)[0] || 'Gênero Desconhecido';
    const genreId = genre.id;

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = genreId;
    checkbox.id = `genre-${genreId}`;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${genreName}`));
    checkboxContainer.appendChild(label);
  });
}

// <-- CORREÇÃO: Esta função agora será chamada pelo event listener correto.
function handleApplyFilter() {
  currentFilters = [];
  filtroDropdown.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
    currentFilters.push(checkbox.value);
  });
  currentPage = 1;
  loadManga();
  filtroDropdown.style.display = 'none';
}

async function fetchManga(offset = 0, title = '', tags = []) {
  let url = `${BASE_URL}/manga?limit=${MANGA_LIMIT}&offset=${offset}&order[createdAt]=desc&includes[]=cover_art&availableTranslatedLanguage[]=pt-br`;
  if (title) {
    url += `&title=${encodeURIComponent(title)}`;
  }
  if (tags.length > 0) {
    tags.forEach(tagId => {
      url += `&includedTags[]=${encodeURIComponent(tagId)}`;
    });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching manga:', error);
    return null;
  }
}

async function displayManga(mangaData) {
  mangaGrid.innerHTML = '';

  if (!mangaData || !mangaData.data || mangaData.data.length === 0) {
    mangaGrid.innerHTML = '<p>Nenhum mangá encontrado.</p>';
    return;
  }

  for (const manga of mangaData.data) {
    const mangaCard = document.createElement('div');
    mangaCard.classList.add('manga-card');

    const title = manga.attributes.title.en || manga.attributes.title['pt-br'] || Object.values(manga.attributes.title)[0] || 'Título Desconhecido';
    const mangaId = manga.id;
    let coverUrl = 'placeholder.png';

    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (coverRel && coverRel.attributes) {
      const fileName = coverRel.attributes.fileName;
      coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    }

    mangaCard.innerHTML = `
      <img src="${coverUrl}" alt="${title}">
      <p>${title}</p>
    `;

    mangaCard.addEventListener('click', () => {
      const mangaDexUrl = `https://mangadex.org/title/${mangaId}`;
      window.open(mangaDexUrl, '_blank');
    });

    mangaGrid.appendChild(mangaCard);
  }
}

function updatePaginationControls(total) {
  paginationControls.innerHTML = '';
  const totalPages = Math.ceil(total / MANGA_LIMIT);

  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('btn-pag');
    prevBtn.innerHTML = '&#171;';
    prevBtn.addEventListener('click', () => {
      currentPage--;
      loadManga();
    });
    paginationControls.appendChild(prevBtn);
  }

  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.classList.add('btn-pag');
    if (i === currentPage) {
      pageBtn.classList.add('ativo');
    }
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      loadManga();
    });
    paginationControls.appendChild(pageBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('btn-pag');
    nextBtn.innerHTML = '&#187;';
    nextBtn.addEventListener('click', () => {
      currentPage++;
      loadManga();
    });
    paginationControls.appendChild(nextBtn);
  }
}

async function loadManga() {
  const offset = (currentPage - 1) * MANGA_LIMIT;
  const mangaData = await fetchManga(offset, currentSearchQuery, currentFilters);
  if (mangaData) {
    displayManga(mangaData);
    updatePaginationControls(mangaData.total);
  } else {
    mangaGrid.innerHTML = '<p>Não foi possível carregar os mangás. Tente novamente mais tarde.</p>';
    paginationControls.innerHTML = '';
  }
}

// --- Event Listeners ---

if (searchButton && searchInput) {
  searchButton.addEventListener('click', () => {
    currentSearchQuery = searchInput.value;
    currentPage = 1;
    loadManga();
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentSearchQuery = searchInput.value;
      currentPage = 1;
      loadManga();
    }
  });
}

if (toggleFiltroBtn && filtroDropdown) {
  toggleFiltroBtn.addEventListener('click', () => {
    filtroDropdown.style.display = filtroDropdown.style.display === 'block' ? 'none' : 'block';
  });
}

// <-- CORREÇÃO: Adicionando o listener ao botão "Aplicar" que pegamos do HTML.
if (aplicarFiltroBtn) {
  aplicarFiltroBtn.addEventListener('click', handleApplyFilter);
}

// <-- CORREÇÃO: Centralizando toda a inicialização da página em um único local.
document.addEventListener('DOMContentLoaded', () => {
  // 1. Lógica do Carrossel Inicial
  fetchMangasFromAPI();

  // 2. Lógica do Catálogo e Filtros
  loadManga();
  populateGenreFilters(); // <-- CORREÇÃO: Chamando a função para criar os filtros.

  // 3. Lógica do Modo Escuro
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const iconElement = darkModeToggle.querySelector('i');

  const applyTheme = (isDarkMode) => {
    body.classList.toggle('dark-mode', isDarkMode);
    iconElement.classList.remove('fa-sun', 'fa-moon');
    if (isDarkMode) {
      iconElement.classList.add('fa-moon');
    } else {
      iconElement.classList.add('fa-sun');
    }
  };

  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'enabled') {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  darkModeToggle.addEventListener('click', () => {
    let isDarkMode = body.classList.contains('dark-mode');
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
    if (isDarkMode) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.setItem('darkMode', 'disabled');
    }
  });
});

// <-- CORREÇÃO: O bloco de código conflitante que estava aqui foi removido.