// js/swipe-game.js

// ===============================
//  TRAVELSWIPE – SWIPE GAME LOGIC
// ===============================
//
// Ожидаем, что в countries.js объявлен массив объектов, например:
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

//

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Источник данных ---

  // Пытаемся взять массив из глобальной области.
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

  // --- 2. DOM-элементы ---

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

  // --- 3. Работа с localStorage ---

  const STORAGE_KEY = "likedCountries";

  function getLikedFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("TravelSwipe: cannot parse likedCountries from storage", e);
      return [];
    }
  }

  function saveLikedToStorage(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("TravelSwipe: cannot save likedCountries to storage", e);
    }
  }

  // --- 4. Рендер текущей страны ---

  function renderCurrentCountry() {
    if (currentIndex >= countries.length) {
      // Страны кончились
      cardEl.style.visibility = "hidden";
      endEl && (endEl.hidden = false);
      return;
    }

    const c = countries[currentIndex];

    imgEl.style.backgroundImage = `url(${c.image})`;
    nameEl.textContent = c.name || "Tundmatu riik";
    taglineEl.textContent =
      c.description || "Avasta seda sihtkohta!";

    // Поля из твоего JSON
    if (climateEl) climateEl.textContent = c.climate ? `Kliima: ${c.climate}` : "";
    if (costEl) costEl.textContent = c.cost ? `Hind: ${c.cost}` : "";
    if (safetyEl)
      safetyEl.textContent =
        typeof c.safety === "number"
          ? `Turvalisus: ${c.safety}/10`
          : "";
    if (resortEl)
      resortEl.textContent =
        typeof c.resortRating === "number"
          ? `Kuurordid: ${c.resortRating}/10`
          : "";

    // Сброс анимаций
    cardEl.classList.remove("swipe-right", "swipe-left");
    cardEl.style.transform = "translateX(0) rotate(0)";
    cardEl.style.opacity = "1";
    cardEl.style.visibility = "visible";
    endEl && (endEl.hidden = true);
    isAnimating = false;
  }

  // --- 5. Обработка свайпа ---

  function handleSwipe(direction) {
    if (isAnimating || currentIndex >= countries.length) return;
    isAnimating = true;

    const currentCountry = countries[currentIndex];

    if (direction === "right") {
      const liked = getLikedFromStorage();

      // Не добавлять дубликаты по имени
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

    // Ждём завершения CSS-анимации и переходим к следующей
    setTimeout(() => {
      currentIndex++;
      renderCurrentCountry();
    }, 350);
  }

  // --- 6. Кнопки Like / Dislike ---

  if (btnLike) {
    btnLike.addEventListener("click", () => handleSwipe("right"));
  }

  if (btnDislike) {
    btnDislike.addEventListener("click", () => handleSwipe("left"));
  }

  // --- 7. Управление с клавиатуры ---

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

  // --- 8. Свайпы на тач-устройствах ---

  let touchStartX = null;

  cardEl.addEventListener("touchstart", (e) => {
    if (!e.touches || !e.touches.length) return;
    touchStartX = e.touches[0].clientX;
  });

  cardEl.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const SWIPE_THRESHOLD = 60; // px

    if (dx > SWIPE_THRESHOLD) {
      handleSwipe("right");
    } else if (dx < -SWIPE_THRESHOLD) {
      handleSwipe("left");
    }

    touchStartX = null;
  });

  // --- 9. Старт игры ---

  renderCurrentCountry();
});
