// Käivita AOS animatsioonid
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    once: true
  });

  loadResults();
});

// ===== LAADI TULEMUSED =====
async function loadResults() {
  const likedCountries = JSON.parse(localStorage.getItem('likedCountries')) || [];
  const resultsGrid = document.getElementById('resultsGrid');
  const emptyState = document.getElementById('emptyState');

  // Kui pole meelditud riike, näita tühja olekut
  if (likedCountries.length === 0) {
    resultsGrid.style.display = 'none';
    emptyState.hidden = false;
    return;
  }

  // Laadi täielikud riigi andmed JSON-ist, et saada guideUrl
  let countriesData = [];
  try {
    const response = await fetch('../database/countries.json');
    const data = await response.json();
    countriesData = data.countriesData;
  } catch (error) {
    console.error('Viga countries.json laadimisel:', error);
  }

  // Näita tulemusi
  resultsGrid.style.display = 'grid';
  emptyState.hidden = true;

  // Loo kaardid - ühenda meelditud riigid täielike andmetega JSON-ist
  likedCountries.forEach((country, index) => {
    // Leia täielik riigi andmestik nime järgi
    const fullCountryData = countriesData.find(c => c.name === country.name) || country;
    const card = createResultCard(fullCountryData, index);
    resultsGrid.appendChild(card);
  });
}

// ===== LOO TULEMUSTE KAART =====
function createResultCard(country, index) {
  const card = document.createElement('div');
  card.className = 'result-card';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-delay', Math.min(index * 100, 500));

  // Kaardi pilt
  const img = document.createElement('img');
  img.src = country.image;
  img.alt = country.name;

  // Kaardi ülekate
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

  // Lisa klõpsu käsitleja - ava juhendi URL
  card.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Klõpsatud riik:', country.name);
    console.log('Juhendi URL:', country.guideUrl);

    if (country.guideUrl) {
      console.log('Avan guideUrl:', country.guideUrl);
      window.open(country.guideUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.log('guideUrl puudub, avan Google otsingu');
      // Tagavaravariant kui guideUrl puudub - otsi Google'st
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(country.name + ' travel guide')}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  });

  // Veendu, et ülekate ei blokeeri klõpse
  card.style.cursor = 'pointer';

  return card;
}

// ===== TAGASI ÜLES NUPP =====
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