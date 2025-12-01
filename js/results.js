// Käivita AOS animatsioonid autor codeopen
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
  const carouselSlide = document.getElementById('carouselSlide');
  const carouselContainer = document.querySelector('.carousel-container');
  const emptyState = document.getElementById('emptyState');

  // Kui pole meelditud riike, näita tühja olekut
  if (likedCountries.length === 0) {
    if (carouselContainer) carouselContainer.style.display = 'none';
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

  // Näita karusselli
  if (carouselContainer) carouselContainer.style.display = 'block';
  emptyState.hidden = true;

  // Loo kaardid - ühenda meelditud riigid täielike andmetega JSON-ist
  likedCountries.forEach((country) => {
    // Leia täielik riigi andmestik nime järgi
    const fullCountryData = countriesData.find(c => c.name === country.name) || country;
    const item = createCarouselItem(fullCountryData);
    carouselSlide.appendChild(item);
  });

  // Käivita karusselli navigeerimine
  initCarousel();
}

// ===== LOO KARUSSELLI ELEMENT =====
function createCarouselItem(country) {
  const item = document.createElement('div');
  item.className = 'item';
  item.style.backgroundImage = `url('${country.image}')`;

  const content = document.createElement('div');
  content.className = 'content';

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = country.name;

  const des = document.createElement('div');
  des.className = 'des';
  des.textContent = country.description || 'Avasta see imeline sihtkoht!';

  const seeMore = document.createElement('a');
  seeMore.className = 'seeMore';
  seeMore.target = '_blank';
  seeMore.rel = 'noopener noreferrer';

  // Määra link guideUrl või Google otsingu järgi
  if (country.guideUrl) {
    seeMore.href = country.guideUrl;
  } else {
    seeMore.href = `https://www.google.com/search?q=${encodeURIComponent(country.name + ' travel guide')}`;
  }

  const button = document.createElement('button');
  button.textContent = 'Vaata rohkem';

  seeMore.appendChild(button);
  content.appendChild(name);
  content.appendChild(des);
  content.appendChild(seeMore);
  item.appendChild(content);

  return item;
}

// ===== KARUSSELLI NAVIGEERIMINE =====
function initCarousel() {
  const next = document.querySelector('.next');
  const prev = document.querySelector('.prev');

  if (next) {
    next.addEventListener('click', function () {
      let items = document.querySelectorAll('.item');
      document.querySelector('.slide').appendChild(items[0]);
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      let items = document.querySelectorAll('.item');
      document.querySelector('.slide').prepend(items[items.length - 1]);
    });
  }

  // Klaviatuuri tugi
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && prev) {
      prev.click();
    } else if (e.key === 'ArrowRight' && next) {
      next.click();
    }
  });
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