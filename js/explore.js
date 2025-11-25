`
// js/swipe-game.js

// ===============================
//  TRAVELSWIPE – SWIPE GAME LOGIC
// ===============================
//
//
//
// const countriesData = [
//   {
//     name: "Hispaania",
//     image: "images/spain.jpg",
//     safety: 7,
//     climate: "Soe ja päikeseline",
//     cost: "Keskmisest kõrgem",
//     resortRating: 9,
//     description: "Rikkalik kultuur..."
//   },
//   ...
// ];
//

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. DATA SOURCE ---

  // Try to get the array from the global scope (loaded from countries.js)
  const countries =
    window.countriesData ||
    window.countries ||
    [];

  if (!Array.isArray(countries) || countries.length === 0) {
    console.warn("TravelSwipe: countriesData is empty or not found.");
    return;
  }

  let currentIndex = 0;
  let isAnimating = false;

  // --- 2. DOM ELEMENTS ---

  const cardEl = document.getElementById("swipeCard");
  const imgEl = document.getElementById("countryImage");
  const nameEl = document.getElementById("countryName");
  const taglineEl = document.getElementById("countryTagline");

  const climateEl = document.getElementById("countryClimate");
  const costEl = document.getElementById("countryCost");
  const safetyEl = document.getElementById("countrySafety");
  const resortEl = document.getElementById("countryResort");

  const btnLike = document.getElementById("btnLike");
  const btnDislike = document.getElementById("btnDislike");
  const endEl = document.getElementById("swipeEnd");

  if (!cardEl || !imgEl || !nameEl || !taglineEl) {
    console.warn("TravelSwipe: swipe-game elements not found in DOM.");
    return;
  }

  // --- 3. LOCAL STORAGE HANDLING ---

  const STORAGE_KEY = "likedCountries";

  // Load liked countries from storage
  function getLikedFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("TravelSwipe: cannot parse likedCountries from storage", e);
      return [];
    }
  }

  // Save updated liked countries list
  function saveLikedToStorage(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("TravelSwipe: cannot save likedCountries to storage", e);
    }
  }

  // --- 4. RENDER CURRENT COUNTRY CARD ---

  function renderCurrentCountry() {
    if (currentIndex >= countries.length) {
      // No more countries left
      cardEl.style.visibility = "hidden";
      endEl && (endEl.hidden = false);
      return;
    }

    const c = countries[currentIndex];

    imgEl.style.backgroundImage = `url(${c.image})`;
    nameEl.textContent = c.name || "Unknown country";
    taglineEl.textContent =
      c.description || "Discover this destination!";

    // Fields from your JSON
    if (climateEl) climateEl.textContent = c.climate ? `Climate: ${c.climate}` : "";
    if (costEl) costEl.textContent = c.cost ? `Cost: ${c.cost}` : "";
    if (safetyEl)
      safetyEl.textContent =
        typeof c.safety === "number"
          ? `Safety: ${c.safety}/10`
          : "";
    if (resortEl)
      resortEl.textContent =
        typeof c.resortRating === "number"
          ? `Resorts: ${c.resortRating}/10`
          : "";

    // Reset animations
    cardEl.classList.remove("swipe-right", "swipe-left");
    cardEl.style.transform = "translateX(0) rotate(0)";
    cardEl.style.opacity = "1";
    cardEl.style.visibility = "visible";
    endEl && (endEl.hidden = true);
    isAnimating = false;
  }

  // --- 5. SWIPE HANDLING ---

  function handleSwipe(direction) {
    if (isAnimating || currentIndex >= countries.length) return;
    isAnimating = true;

    const currentCountry = countries[currentIndex];

    if (direction === "right") {
      const liked = getLikedFromStorage();

      // Prevent duplicates (checked by name)
      if (!liked.some((item) => item.name === currentCountry.name)) {
        liked.push({
          name: currentCountry.name,
          image: currentCountry.image,
          description: currentCountry.description,
          climate: currentCountry.climate,
          cost: currentCountry.cost,
          safety: currentCountry.safety,
          resortRating: currentCountry.resortRating,
        });
        saveLikedToStorage(liked);
      }

      cardEl.classList.add("swipe-right");
    } else {
      cardEl.classList.add("swipe-left");
    }

    // Wait for CSS animation to end, then load next card
    setTimeout(() => {
      currentIndex++;
      renderCurrentCountry();
    }, 350);
  }

  // --- 6. BUTTON CONTROLS ---

  if (btnLike) {
    btnLike.addEventListener("click", () => handleSwipe("right"));
  }

  if (btnDislike) {
    btnDislike.addEventListener("click", () => handleSwipe("left"));
  }

  // --- 7. KEYBOARD CONTROLS ---

  window.addEventListener("keydown", (e) => {
    if (currentIndex >= countries.length) return;

    switch (e.key) {
      case "ArrowRight":
      case "d":
      case "D":
        handleSwipe("right");
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        handleSwipe("left");
        break;
      case " ":
      case "Spacebar":
        e.preventDefault();
        handleSwipe("right");
        break;
      default:
        break;
    }
  });

  // --- 8. TOUCH SWIPES (MOBILE) ---

  let touchStartX = null;

  cardEl.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches.length) return;
    touchStartX = e.touches[0].clientX;
  });

  cardEl.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const SWIPE_THRESHOLD = 60; // px movement required

    if (dx > SWIPE_THRESHOLD) {
      handleSwipe("right");
    } else if (dx < -SWIPE_THRESHOLD) {
      handleSwipe("left");
    }

    touchStartX = null;
  });

  // --- 9. START GAME ---

  renderCurrentCountry();
});
=======
async function loadCountries() {
  try {
    const res = await fetch('../database/countries.json');  // adjust path if needed

    if (!res.ok) throw new Error(`Failed to load JSON: ${res.status}`);

    // Base URL for resolving relative paths
    const baseURL = res.url;

    const data = await res.json();

    // Read the "countries" array
    const countries = data.countries || [];

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    countries.forEach(country => {
      // Resolve image path relative to the JSON file
      const imageUrl = new URL(country.image, baseURL).href;

      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = country.name;
      img.loading = 'lazy';

      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.textContent = country.name;

      card.appendChild(img);
      card.appendChild(nameEl);

      gallery.appendChild(card);
    });

  } catch (err) {
    console.error('Error:', err);
    document.getElementById('gallery').textContent = 'Failed to load countries.';
  }
}

document.addEventListener('DOMContentLoaded', loadCountries);

