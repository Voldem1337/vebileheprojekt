document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // 1. AOS Fade Animations
  // ===============================
  AOS.init({
    duration: 1000,   // animation duration
    once: true        // animate elements only once
  });

  // ===============================
  // 2. Logo scroll to top
  // ===============================
  document.querySelectorAll('.logo img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ===============================
  // 3. Back-to-top button + navbar
  // ===============================
  const toTopBtn = document.getElementById("toTopBtn");
  const navbar  = document.querySelector(".navbar");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    // back-to-top button (если есть)
    if (toTopBtn) {
      if (window.scrollY > 300) {
        toTopBtn.style.display = "block";
      } else {
        toTopBtn.style.display = "none";
      }
    }

    // navbar show/hide (если есть)
    if (navbar) {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.classList.add("hidden");   // scrolling down
      } else {
        navbar.classList.remove("hidden"); // scrolling up
      }
      lastScrollY = window.scrollY;
    }
  });



  // ===============================
  // 4. JSON test: read & show data
  // ===============================


  const testContainer = document.getElementById("jsonTest");
  if (testContainer) {
    fetch("../database/countries.json")
      .then(res => res.json())
      .then(data => {
        console.log("JSON loaded:", data);

        if (!data.countriesData) {
          console.error("JSON has no 'countriesData' field");
          return;
        }

        data.countriesData.forEach(country => {
          const block = document.createElement("div");
          block.className = "test-country";

          block.innerHTML = `
            <h3>${country.name}</h3>
            <img src="../database/${country.image}" style="width:200px; border-radius:10px;">
            <p>${country.description}</p>
            <p><b>Climate:</b> ${country.climate}</p>
            <p><b>Cost:</b> ${country.cost}</p>
            <p><b>Safety:</b> ${country.safety}</p>
            <p><b>Resort:</b> ${country.resortRating}</p>
          `;

          testContainer.appendChild(block);
        });
      })
      .catch(err => {
        console.error("JSON load failed:", err);
      });
  }


});
