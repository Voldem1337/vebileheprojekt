// Initialize AOS animations
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    once: true
  });
});

// ===== CARD DATA & STATE =====
let countries = [];
let currentIndex = 0;
let likedCountries = [];

// ===== DOM ELEMENTS =====
const stackContainer = document.getElementById('stackContainer');
const btnLike = document.getElementById('btnLike');
const btnDislike = document.getElementById('btnDislike');
const swipeEnd = document.getElementById('swipeEnd');
const swipeControls = document.querySelector('.swipe-controls');

// ===== LOAD JSON DATA =====
async function loadCountries() {
  try {
    const response = await fetch('../database/countries.json');
    const data = await response.json();
    countries = data.countriesData;

    // Load saved likes from localStorage
    const saved = localStorage.getItem('likedCountries');
    if (saved) {
      likedCountries = JSON.parse(saved);
    }

    // Render first cards
    renderCards();
  } catch (error) {
    console.error('Error loading countries:', error);
    stackContainer.innerHTML = '<p style="color: red;">Viga andmete laadimisel</p>';
  }
}

// ===== RENDER CARDS =====
function renderCards() {
  stackContainer.innerHTML = '';

  // Show 3 cards in stack (current + 2 preview)
  for (let i = 0; i < 3; i++) {
    const index = currentIndex + i;
    if (index >= countries.length) break;

    const card = createCard(countries[index], i);
    stackContainer.appendChild(card);
  }

  // If no more cards, show end message
  if (currentIndex >= countries.length) {
    showEndMessage();
  }
}

// ===== CREATE CARD ELEMENT =====
function createCard(country, stackPosition) {
  const card = document.createElement('div');
  card.className = 'swipe-card';
  card.style.zIndex = 100 - stackPosition;
  card.style.transform = `scale(${1 - stackPosition * 0.05}) translateY(${stackPosition * 10}px)`;

  // Card image
  const img = document.createElement('img');
  img.src = country.image;
  img.alt = country.name;
  img.className = 'card-image';

  // Card info overlay (appears on hover)
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

  // Only add swipe to top card
  if (stackPosition === 0) {
    addSwipeListeners(card);
  }

  return card;
}

// ===== GENERATE STARS (1-10 scale to 5 stars) =====
function generateStars(rating) {
  const stars = Math.round(rating / 2); // Convert 1-10 to 1-5
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= stars ? '★' : '☆';
  }
  return html;
}

// ===== SWIPE FUNCTIONALITY =====
let startX = 0;
let currentX = 0;
let isDragging = false;
let currentCard = null;

function addSwipeListeners(card) {
  currentCard = card;

  // Mouse events
  card.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);

  // Touch events (for mobile)
  card.addEventListener('touchstart', onDragStart);
  document.addEventListener('touchmove', onDragMove);
  document.addEventListener('touchend', onDragEnd);
}

function onDragStart(e) {
  isDragging = true;
  startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
  currentCard.style.transition = 'none';
}

function onDragMove(e) {
  if (!isDragging) return;

  currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
  const deltaX = currentX - startX;
  const rotation = deltaX / 20;

  currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;

  // Visual feedback
  if (Math.abs(deltaX) > 50) {
    currentCard.style.opacity = 1 - Math.abs(deltaX) / 300;
  }
}

function onDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  const deltaX = currentX - startX;
  const threshold = 100;

  if (Math.abs(deltaX) > threshold) {
    // Swipe detected
    if (deltaX > 0) {
      swipeRight();
    } else {
      swipeLeft();
    }
  } else {
    // Return to center
    currentCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    currentCard.style.transform = '';
    currentCard.style.opacity = '1';
  }
}

// ===== SWIPE ACTIONS =====
function swipeRight() {
  animateCardOut(currentCard, 'right');
  saveCountry(countries[currentIndex]);
  nextCard();
}

function swipeLeft() {
  animateCardOut(currentCard, 'left');
  nextCard();
}

function animateCardOut(card, direction) {
  const distance = direction === 'right' ? 1000 : -1000;
  card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  card.style.transform = `translateX(${distance}px) rotate(${distance / 10}deg)`;
  card.style.opacity = '0';
}

function nextCard() {
  currentIndex++;
  setTimeout(() => {
    renderCards();
  }, 300);
}

function saveCountry(country) {
  if (!likedCountries.find(c => c.name === country.name)) {
    likedCountries.push(country);
    localStorage.setItem('likedCountries', JSON.stringify(likedCountries));
  }
}

// ===== BUTTON CONTROLS =====
btnLike.addEventListener('click', () => {
  if (currentIndex < countries.length) {
    swipeRight();
  }
});

btnDislike.addEventListener('click', () => {
  if (currentIndex < countries.length) {
    swipeLeft();
  }
});

// ===== KEYBOARD CONTROLS =====
document.addEventListener('keydown', (e) => {
  if (currentIndex >= countries.length) return;

  if (e.key === 'ArrowLeft') {
    swipeLeft();
  } else if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault(); // Prevent page scroll on space
    swipeRight();
  }
});

// ===== END MESSAGE WITH CONFETTI =====
function showEndMessage() {
  // Hide buttons
  swipeControls.style.opacity = '0';
  swipeControls.style.transform = 'scale(0.8)';
  setTimeout(() => {
    swipeControls.style.display = 'none';
  }, 300);

  // Show end message
  swipeEnd.hidden = false;
  swipeEnd.style.animation = 'fadeInUp 0.6s ease';

  // Create confetti
  createConfetti();
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
  const colors = ['#ff4458', '#667eea', '#764ba2', '#FFD700', '#00d4ff', '#f093fb'];
  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      document.body.appendChild(confetti);

      // Remove after animation
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 20);
  }
}

// ===== BACK TO TOP BUTTON =====
const toTopBtn = document.getElementById('toTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    toTopBtn.classList.add('visible');
  } else {
    toTopBtn.classList.remove('visible');
  }
});

toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== START APP =====
loadCountries();