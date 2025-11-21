
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


function initRollingCounters() {
  const digits = document.querySelectorAll(".rolling-digit");

  const sequence = [1, 3, 2, 5, 7];
  const duration = 2000;
  const easing = "cubic-bezier(0.25, 0.8, 0.25, 1)";

  digits.forEach(digit => {
    const target = digit.dataset.target;

    const roller = document.createElement("div");
    roller.className = "rolling-counter-roller";

    const track = document.createElement("div");
    track.className = "rolling-counter-track";

    // intermediate items
    sequence.forEach(num => {
      const item = document.createElement("div");
      item.className = "rolling-counter-item";
      item.textContent = num;
      track.appendChild(item);
    });

    // final value
    const final = document.createElement("div");
    final.className = "rolling-counter-item";
    final.textContent = target;
    track.appendChild(final);

    roller.appendChild(track);
    digit.innerHTML = "";
    digit.appendChild(roller);

    requestAnimationFrame(() => {
      const h = track.firstElementChild.offsetHeight;
      track.style.transition = `transform ${duration}ms ${easing}`;

      requestAnimationFrame(() => {
        track.style.transform = `translateY(${-h * sequence.length}px)`;
      });
    });
  });
}

const stats = document.querySelector("#stats");

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    initRollingCounters();
    observer.disconnect();
  }
}, { threshold: 0.35 });

observer.observe(stats);



// Start animation when section becomes visible
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      playCounters();
      observer.disconnect();
    }
  });
});

observer.observe(document.querySelector("#stats"));


window.addEventListener("scroll", startRollingCounters);
