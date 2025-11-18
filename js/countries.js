
// --- 1. Initialize AOS animations ---
AOS.init({
  duration: 1000, // animation duration in milliseconds
  once: true      // run the animation only once per element
});

// --- 2. Make logo scroll to top when clicked ---
document.querySelectorAll('.logo img').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// --- 3. Back-to-top button ---
const toTopBtn = document.getElementById("toTopBtn");

// Show button when the user scrolls down
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 300) {
    toTopBtn.style.display = "block";
  } else {
    toTopBtn.style.display = "none";
  }
});

// Scroll smoothly to the top when the button is clicked
toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// --- 4. Navbar hide/show on scroll ---
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    // Scrolling down → hide navbar
    navbar.classList.add('hidden');
  } else {
    // Scrolling up → show navbar
    navbar.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

// --- 5. Rolling counter animation (slower & smoother) ---
let countersAnimated = false;

function startRollingCounters() {
  const counters = document.querySelectorAll(".rolling-counter");
  const statsSection = document.querySelector("#stats");
  const sectionTop = statsSection.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  // Trigger once when the section becomes visible
  if (sectionTop < screenHeight - 100 && !countersAnimated) {
    countersAnimated = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000; // total animation time (ms)
      const frameRate = 30; // frames per second
      const totalFrames = Math.round((duration / 1000) * frameRate);
      const step = Math.ceil(target / totalFrames);
      let currentValue = 0;
      let frame = 0;

      const interval = setInterval(() => {
        frame++;
        currentValue += step;

        // Create span for the rolling effect
        const span = document.createElement("span");
        span.textContent = currentValue >= target ? target : currentValue;
        counter.innerHTML = "";
        counter.appendChild(span);
        span.style.animation = "rollDown 0.6s ease-out forwards";

        // When animation ends → set final value
        if (frame >= totalFrames) {
          clearInterval(interval);
          let finalText = target.toLocaleString();
          if (target >= 1000) finalText = "4k+";
          if (target === 98) finalText = "98%";
          if (target === 50) finalText = "50+";
          counter.textContent = finalText;
        }
      }, 1000 / frameRate); // update interval (in ms)
    });
  }
  let i = 1
}


window.addEventListener("scroll", startRollingCounters);
