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
// 3. Back-to-top button
// ===============================
const toTopBtn = document.getElementById("toTopBtn");

// Show/hide when scrolling
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTopBtn.style.display = "block";
  } else {
    toTopBtn.style.display = "none";
  }
});

// Scroll to top
toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===============================
// 4. Navbar hide/show on scroll
// ===============================
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    // scrolling down
    navbar.classList.add('hidden');
  } else {
    // scrolling up
    navbar.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

// ===============================
// Game and json reading
// ===============================

// Test: Load JSON and show all countries on screen
document.addEventListener("DOMContentLoaded", () => {

  fetch("../database/countries.json")
    .then(res => res.json())
    .then(data => {
      console.log("JSON loaded:", data);

      const container = document.getElementById("jsonTest");

      if (!container) {
        console.error("NO TEST CONTAINER FOUND!");
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

        container.appendChild(block);
      });
    })
    .catch(err => {
      console.error("JSON load failed:", err);
    });

});
