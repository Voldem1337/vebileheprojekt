
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

function initRollingCounters() {
  const counters = document.querySelectorAll(".rolling-counter");

  // Fixed scrolling sequence (numbers the roller will cycle through)
  const sequence = [2, 5, 1, 3, 4];
  const duration = 2000; // Total animation duration (2 seconds)
  const easing = "cubic-bezier(0.25, 0.8, 0.25, 1)"; // Smooth easing curve

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const suffix = counter.dataset.suffix || "";

    // Create the roller wrapper (acts like a mask for vertical scrolling)
    const roller = document.createElement("div");
    roller.className = "rolling-counter-roller";

    // Inner track that will actually move vertically
    const track = document.createElement("div");
    track.className = "rolling-counter-track";

    // Build the vertical list (each number is one “step” of the scroll)
    sequence.forEach((num, index) => {
      const item = document.createElement("div");
      item.className = "rolling-counter-item";

      // The final item must display the actual target value
      const value = (index === sequence.length - 1) ? target : num;
      item.textContent = value + suffix;

      track.appendChild(item);
    });

    roller.appendChild(track);

    // Replace the original number with our animated roller
    counter.textContent = "";
    counter.appendChild(roller);

    // Wait one frame so the browser calculates dimensions
    requestAnimationFrame(() => {
      const itemHeight = track.firstElementChild.offsetHeight;

      // Set initial position (track starts at the very top)
      track.style.transform = "translateY(0)";
      track.style.transition = "transform " + duration + "ms " + easing;

      // On the next frame, move the track upward to show the last item
      requestAnimationFrame(() => {
        const offset = -itemHeight * (sequence.length - 1);
        track.style.transform = "translateY(" + offset + "px)";
      });
    });
  });
}

// Start animation when the stats section becomes visible
const statsSection = document.querySelector("#stats");

if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initRollingCounters();
        observer.disconnect(); // Run once only
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);
}



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
// fix video bug when loaded again
document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.background-video');

  // on load
  if (video) {
    video.play();
  }

  // when browser is opened again taking data from cache
  window.addEventListener('pageshow', function(event) {
    if (event.persisted && video) {
      video.play();
    }
  });

  // additional check
  window.addEventListener('focus', function() {
    if (video && video.paused) {
      video.play();
    }
  });
});