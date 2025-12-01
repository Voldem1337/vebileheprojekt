// Käivita AOS animatsioonid
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    once: true
  });
});

// ===== KAARDI ANDMED & OLEK =====
let countries = []; // Kõik riigid JSON failist
let currentIndex = 0; // Praegune kaardi indeks
let likedCountries = []; // Meelditud riigid (salvestan localStorage'sse)

// ===== DOM ELEMENDID =====
const stackContainer = document.getElementById('stackContainer'); // Konteiner kaartide kuhjale
const btnLike = document.getElementById('btnLike'); // Meeldib nupp
const btnDislike = document.getElementById('btnDislike'); // Ei meeldi nupp
const swipeEnd = document.getElementById('swipeEnd'); // Lõpu sõnum
const swipeControls = document.querySelector('.swipe-controls'); // Juhtimise nupud

// ===== LAADI JSON ANDMED =====
async function loadCountries() {
  try {
    // Tühjenda eelmised valikud kui lehele sisestatakse
    // Et alustada mängu algusest
    localStorage.removeItem('likedCountries');
    likedCountries = [];

    // Tõmba riikide andmed JSON failist
    const response = await fetch('../database/countries.json');
    const data = await response.json();
    countries = data.countriesData;

    // Kuva esimesed kaardid
    renderCards();
  } catch (error) {
    console.error('Viga riikide laadimisel:', error);
    stackContainer.innerHTML = '<p style="color: red;">Viga andmete laadimisel</p>';
  }
}

// ===== KUVA KAARDID =====
function renderCards() {
  stackContainer.innerHTML = '';

  // Näita 3 kaarti kuhjas (praegune + 2 eelvaadet)
  for (let i = 0; i < 3; i++) {
    const index = currentIndex + i;
    if (index >= countries.length) break; // Kui kaarte pole enam, lõpeta

    const card = createCard(countries[index], i);
    stackContainer.appendChild(card);
  }

  // Kui kaarte pole enam, näita lõpusõnumit
  if (currentIndex >= countries.length) {
    showEndMessage();
  }
}

// ===== LOO KAARDI ELEMENT =====
function createCard(country, stackPosition) {
  const card = document.createElement('div');
  card.className = 'swipe-card';
  // Määra z-index ja transformatsioon kuhja efekti jaoks
  card.style.zIndex = 100 - stackPosition;
  card.style.transform = `scale(${1 - stackPosition * 0.05}) translateY(${stackPosition * 10}px)`;

  // Kaardi pilt
  const img = document.createElement('img');
  img.src = country.image;
  img.alt = country.name;
  img.className = 'card-image';

  // Kaardi info ülekate (ilmub hiirega üle sõitmisel)
  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  overlay.innerHTML = `
    <h2>${country.name}</h2>
    <div class="card-info">
      <div class="info-row">
        <span class="info-label">Turvalisus:</span>
        <span class="stars">${generateStars(country.safety)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Kuurort:</span>
        <span class="stars">${generateStars(country.resortRating)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Kliima:</span>
        <span>${country.climate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Hind:</span>
        <span>${country.cost}</span>
      </div>
      <p class="card-description">${country.description}</p>
    </div>
  `;

  card.appendChild(img);
  card.appendChild(overlay);

  // Lisa swipe kuulajad ainult ülemisele kaardile
  if (stackPosition === 0) {
    addSwipeListeners(card);
  }

  return card;
}

// ===== GENEREERI TÄHED (1-10 skaalast 5 tähte) =====
function generateStars(rating) {
  const stars = Math.round(rating / 2); // Teisenda 1-10 skaalast 1-5 skaalale
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= stars ? '★' : '☆'; // Täidetud või tühi täht
  }
  return html;
}

// ===== SWIPE FUNKTSIOON =====
let startX = 0; // Algne X positsioon
let currentX = 0; // Praegune X positsioon
let isDragging = false; // Kas lohistatakse
let currentCard = null; // Praegune kaart

function addSwipeListeners(card) {
  currentCard = card;

  // Hiire sündmused (arvutile)
  card.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);

  // Puudutus sündmused (mobiilile)
  card.addEventListener('touchstart', onDragStart);
  document.addEventListener('touchmove', onDragMove);
  document.addEventListener('touchend', onDragEnd);
}

function onDragStart(e) {
  isDragging = true;
  // Salvesta algne X positsioon (hiir või puudutus)
  startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
  currentCard.style.transition = 'none'; // Eemalda animatsioon lohistamise ajal
}

function onDragMove(e) {
  if (!isDragging) return; // Kui ei lohistata, ära tee midagi

  // Hangi praegune X positsioon
  currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const deltaX = currentX - startX; // Arvuta liikumise kaugus
  const rotation = deltaX / 20; // Arvuta pöördenurk

  // Liiguta ja pööra kaarti
  currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;

  // Visuaalne tagasiside - vähenda läbipaistvust kui liigutakse kaugele
  if (Math.abs(deltaX) > 50) {
    currentCard.style.opacity = 1 - Math.abs(deltaX) / 300;
  }
}

function onDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  const deltaX = currentX - startX; // Arvuta kogukaugus
  const threshold = 100; // Künnispunkt swipe'i tuvastamiseks

  if (Math.abs(deltaX) > threshold) {
    // Swipe tuvastatud - kontrolli suunda
    if (deltaX > 0) {
      swipeRight(); // Paremale - meeldib
    } else {
      swipeLeft(); // Vasakule - ei meeldi
    }
  } else {
    // Tagasi keskele - swipe ei olnud piisavalt tugev
    currentCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    currentCard.style.transform = '';
    currentCard.style.opacity = '1';
  }
}

// ===== SWIPE TEGEVUSED =====
function swipeRight() {
  animateCardOut(currentCard, 'right'); // Animeeri kaart välja paremale
  // Salvesta TÄIELIK riigi objekt KÕIGI andmetega, sealhulgas guideUrl
  saveCountry(countries[currentIndex]);
  nextCard(); // Mine järgmise kaardi juurde
}

function swipeLeft() {
  animateCardOut(currentCard, 'left'); // Animeeri kaart välja vasakule
  nextCard(); // Mine järgmise kaardi juurde (ei salvesta)
}

function animateCardOut(card, direction) {
  // Animeeri kaart ekraanilt välja
  const distance = direction === 'right' ? 1000 : -1000; // Positiivne või negatiivne
  card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  card.style.transform = `translateX(${distance}px) rotate(${distance / 10}deg)`;
  card.style.opacity = '0'; // Muuda läbipaistvaks
}

function nextCard() {
  currentIndex++; // Suurenda indeksit
  // Oota pisut enne järgmiste kaartide kuvamist
  setTimeout(() => {
    renderCards();
  }, 300);
}

function saveCountry(country) {
  // Salvesta kogu riigi objekt (sisaldab nime, pilti, guideUrl'i jne)
  if (!likedCountries.find(c => c.name === country.name)) {
    likedCountries.push(country);
    localStorage.setItem('likedCountries', JSON.stringify(likedCountries));
    console.log('Salvestatud riik:', country); // Debug
  }
}

// ===== NUPPUDE JUHTIMINE =====
btnLike.addEventListener('click', () => {
  if (currentIndex < countries.length) {
    swipeRight(); // Meeldib - swipe paremale
  }
});

btnDislike.addEventListener('click', () => {
  if (currentIndex < countries.length) {
    swipeLeft(); // Ei meeldi - swipe vasakule
  }
});

// ===== KLAVIATUURI JUHTIMINE =====
document.addEventListener('keydown', (e) => {
  if (currentIndex >= countries.length) return; // Kui kaarte pole enam, ära tee midagi

  if (e.key === 'ArrowLeft') {
    swipeLeft(); // Vasak nool - ei meeldi
  } else if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault(); // Väldi lehe kerimist tühiku vajutamisel
    swipeRight(); // Parem nool või tühik - meeldib
  }
});

// ===== LÕPU SÕNUM KONFETTIDEGA =====
function showEndMessage() {
  const saved = JSON.parse(localStorage.getItem('likedCountries')) || [];

  // Peida juhtimisnupud
  swipeControls.style.opacity = '0';
  swipeControls.style.transform = 'scale(0.8)';
  setTimeout(() => {
    swipeControls.style.display = 'none';
  }, 300);

  // Näita lõpublokki
  setTimeout(() => {
    swipeEnd.classList.add('show');

    // ========= JUHTUM 1: KASUTAJA EI VALINUD ÜHTEGI RIIKI =========
    if (saved.length === 0) {
      swipeEnd.innerHTML = `
        <h2>Kahjuks sa ei valinud ühtegi riiki.</h2>
        <p>Tulemuste nägemiseks vali vähemalt üks riik.</p>
        <button id="restartBtn" class="swipe-results-link">
          Alusta uuesti
        </button>
      `;

      // Lisa restart nupule sündmus
      document.getElementById("restartBtn").addEventListener("click", () => {
        // Tühjenda valikud
        localStorage.removeItem("likedCountries");
        // Taaskäivita mäng
        currentIndex = 0;
        swipeEnd.classList.remove("show");

        swipeControls.style.display = "flex";
        swipeControls.style.opacity = "1";

        renderCards();
      });

      return; // Lõpeta siin!
    }

    // ========= JUHTUM 2: KASUTAJA VALIS 1+ RIIKI =========
    createConfetti(); // Loo konfettid

    swipeEnd.innerHTML = `
      <h2>Oled kõik riigid läbi vaadanud!</h2>
      <a id="resultsLink" href="results.html" class="swipe-results-link">
        Vaata tulemusi
      </a>
    `;
  }, 150);
}

// ===== KONFETTI ANIMATSIOON =====
function createConfetti() {
  const colors = ['#ff4458', '#667eea', '#764ba2', '#FFD700', '#00d4ff', '#f093fb'];
  const confettiCount = 100; // Konfettide arv

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%'; // Juhuslik horisontaalne positsioon
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)]; // Juhuslik värv
      confetti.style.animationDelay = Math.random() * 0.3 + 's'; // Juhuslik viivitus
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'; // Juhuslik kestus
      document.body.appendChild(confetti);

      // Eemalda pärast animatsiooni
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 20); // Viivita iga konfetti loomist veidi
  }
}

// ===== TAGASI ÜLES NUPP =====
const toTopBtn = document.getElementById('toTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    toTopBtn.classList.add('visible'); // Näita nuppu kui keritakse alla
  } else {
    toTopBtn.classList.remove('visible'); // Peida nupp kui ollakse üleval
  }
});

toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Keri sujuvalt üles
});

// ===== KÄIVITA RAKENDUS =====
loadCountries();