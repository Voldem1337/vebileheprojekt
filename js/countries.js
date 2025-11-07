    // --- 1. Initialize AOS animations ---
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true      // run animation only once
    });

    // --- 2. Make logo scroll to top ---
    document.querySelectorAll('.logo img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // --- 3. Back to top button ---
    const toTopBtn = document.getElementById("toTopBtn");

    // Show button when user scrolls down
    window.addEventListener("scroll", () => {
      if (document.documentElement.scrollTop > 300) {
        toTopBtn.style.display = "block";
      } else {
        toTopBtn.style.display = "none";
      }
    });

    // Scroll smoothly to top when button is clicked
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
// Navbar scroll effect (adds blur and light background)
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    // scrolling down → hide navbar
    navbar.classList.add('hidden');
  } else {
    // scrolling up → show navbar
    navbar.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});
// === Rolling counter animation (slower & smoother) ===
let countersAnimated = false;

function startRollingCounters() {
  const counters = document.querySelectorAll(".rolling-counter");
  const statsSection = document.querySelector("#stats");
  const sectionTop = statsSection.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  // Запуск один раз, когда секция появляется
  if (sectionTop < screenHeight - 100 && !countersAnimated) {
    countersAnimated = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000; // общее время анимации (мс)
      const frameRate = 30; // кадров в секунду
      const totalFrames = Math.round((duration / 1000) * frameRate);
      const step = Math.ceil(target / totalFrames);
      let currentValue = 0;
      let frame = 0;

      const interval = setInterval(() => {
        frame++;
        currentValue += step;

        const span = document.createElement("span");
        span.textContent = currentValue >= target ? target : currentValue;
        counter.innerHTML = "";
        counter.appendChild(span);
        span.style.animation = "rollDown 0.6s ease-out forwards";

        if (frame >= totalFrames) {
          clearInterval(interval);
          // финальное значение
          let finalText = target.toLocaleString();
          if (target >= 1000) finalText = "4k+";
          if (target === 98) finalText = "98%";
          if (target === 50) finalText = "50+";
          counter.textContent = finalText;
        }
      }, 1000 / frameRate); // интервалы между обновлениями
    });
  }
}

window.addEventListener("scroll", startRollingCounters);
