// Initialize AOS animations
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    once: true
  });

  loadResults();
});

// ===== LOAD RESULTS =====
async function loadResults() {
  const likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];
  const resultsGrid = document.getElementById('resultsGrid');
  const emptyState = document.getElementById('emptyState');

  // If no liked countries, show empty state
  if (likedCountries.length === 0) {
    resultsGrid.style.display = 'none';
    emptyState.hidden = false;
    return;
  }

  // Load full country data from JSON to get guideUrl
  let countriesData = [];
  try {
    const response = await fetch('../database/countries.json');
    const data = await response.json();
    countriesData = data.countriesData;
  } catch (error) {
    console.error('Error loading countries.json:', error);
  }

  // Show results
  resultsGrid.style.display = 'grid';
  emptyState.hidden = true;

  // Create cards - merge liked countries with full data from JSON
  likedCountries.forEach((country, index) => {
    // Find full country data by name
    const fullCountryData = countriesData.find(c => c.name === country.name) || country;
    const card = createResultCard(fullCountryData, index);
    resultsGrid.appendChild(card);
  });
}

// ===== CREATE RESULT CARD =====
function createResultCard(country, index) {
  const card = document.createElement('div');
  card.className = 'result-card';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', Math.min(index * 100, 500));

  // Card image
  const img = document.createElement('img');
  img.src = country.image;
  img.alt = country.name;

  // Card overlay
  const overlay = document.createElement('div');
  overlay.className = 'result-card-overlay';
  overlay.innerHTML = `
    <h3>${country.name}</h3>
    <div class="card-guide-hint">
      <i class="fas fa-external-link-alt"></i>
      <span>Kliki, et näha reisijuhti</span>
    </div>
  `;

  card.appendChild(img);
  card.appendChild(overlay);

  // Add click handler - open guide URL
  card.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Clicked country:', country.name);
    console.log('Guide URL:', country.guideUrl);

    if (country.guideUrl) {
      console.log('Opening guideUrl:', country.guideUrl);
      window.open(country.guideUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log('No guideUrl found, opening Google search');
      // Fallback if no guideUrl - search on Google
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(country.name + ' travel guide')}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  });

  // Make sure overlay doesn't block clicks
  card.style.cursor = 'pointer';

  return card;
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