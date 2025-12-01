// --- 1. Käivita AOS animatsioonid ---
AOS.init({
  duration: 1000, // animatsiooni kestus millisekundites
  once: true      // käivita animatsioon ainult üks kord elemendi kohta
});

// --- 2. Logo klõpsamisel keri üles ---
document.querySelectorAll('.logo img').forEach(img => {
  img.style.cursor = 'pointer';
  img.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// --- 3. Tagasi üles nupp ---
const toTopBtn = document.getElementById("toTopBtn");

// Näita nuppu kui kasutaja kerib alla
window.addEventListener("scroll", () => {
  if (document.documentElement.scrollTop > 300) {
    toTopBtn.style.display = "block";
  } else {
    toTopBtn.style.display = "none";
  }
});

// Keri sujuvalt üles kui nuppu vajutatakse
toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// --- 4. Navbar peida/näita kerimise ajal ---
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    // Keritakse alla → peida navbar
    navbar.classList.add('hidden');
  } else {
    // Keritakse üles → näita navbar
    navbar.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

// --- 5. Keriva loenduri animatsioon (aeglasem & sujuvam) ---
let countersAnimated = false;

function startRollingCounters() {
  const counters = document.querySelectorAll(".rolling-counter");
  const statsSection = document.querySelector("#stats");
  const sectionTop = statsSection.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  // Käivita üks kord kui sektsioon muutub nähtavaks
  if (sectionTop < screenHeight - 100 && !countersAnimated) {
    countersAnimated = true;

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000; // kogu animatsiooni aeg (ms)
      const frameRate = 30; // kaadrit sekundis
      const totalFrames = Math.round((duration / 1000) * frameRate);
      const step = Math.ceil(target / totalFrames);
      let currentValue = 0;
      let frame = 0;

      const interval = setInterval(() => {
        frame++;
        currentValue += step;

        // Loo span keriva efekti jaoks
        const span = document.createElement("span");
        span.textContent = currentValue >= target ? target : currentValue;
        counter.innerHTML = "";
        counter.appendChild(span);
        span.style.animation = "rollDown 0.6s ease-out forwards";

        // Kui animatsioon lõpeb → määra lõplik väärtus
        if (frame >= totalFrames) {
          clearInterval(interval);
          let finalText = target.toLocaleString();
          if (target >= 1000) finalText = "4k+";
          if (target === 98) finalText = "98%";
          if (target === 50) finalText = "50+";
          counter.textContent = finalText;
        }
      }, 1000 / frameRate); // uuendamise intervall (ms)
    });
  }
  let i = 1
}

function initRollingCounters() {
  const counters = document.querySelectorAll(".rolling-counter");

  // Fikseeritud kerimise järjekord (numbrid, mida loendur tsüklitab)
  const sequence = [2, 5, 1, 3, 4];
  const duration = 2000; // Kogu animatsiooni kestus (2 sekundit)
  const easing = "cubic-bezier(0.25, 0.8, 0.25, 1)"; // Sujuv kõver

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const suffix = counter.dataset.suffix || "";

    // Loo kerimise ümbris (toimib maskina vertikaalsele kerimisele)
    const roller = document.createElement("div");
    roller.className = "rolling-counter-roller";

    // Sisemine rada, mis tegelikult liigub vertikaalselt
    const track = document.createElement("div");
    track.className = "rolling-counter-track";

    // Ehita vertikaalne nimekiri (iga number on üks kerimise "samm")
    sequence.forEach((num, index) => {
      const item = document.createElement("div");
      item.className = "rolling-counter-item";

      // Viimane element peab kuvama tegeliku siht väärtuse
      const value = (index === sequence.length - 1) ? target : num;
      item.textContent = value + suffix;

      track.appendChild(item);
    });

    roller.appendChild(track);

    // Asenda algne number meie animeeritud loenduri ga
    counter.textContent = "";
    counter.appendChild(roller);

    // Oota üks kaader, et brauser arvutaks dimensioonid
    requestAnimationFrame(() => {
      const itemHeight = track.firstElementChild.offsetHeight;

      // Määra algpositsioon (rada algab kõige ülevalt)
      track.style.transform = "translateY(0)";
      track.style.transition = "transform " + duration + "ms " + easing;

      // Järgmisel kaadril liiguta rada ülespoole, et näidata viimast elementi
      requestAnimationFrame(() => {
        const offset = -itemHeight * (sequence.length - 1);
        track.style.transform = "translateY(" + offset + "px)";
      });
    });
  });
}

// Käivita animatsioon kui statistika sektsioon muutub nähtavaks
const statsSection = document.querySelector("#stats");

if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initRollingCounters();
        observer.disconnect(); // Käivita ainult üks kord
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);
}



// Käivita animatsioon kui sektsioon muutub nähtavaks
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
// paranda video viga kui uuesti laaditakse
document.addEventListener('DOMContentLoaded', function() {
  const video = document.querySelector('.background-video');

  // laadimisel
  if (video) {
    video.play();
  }

  // kui brauser avatakse uuesti võttes andmeid vahemälust
  window.addEventListener('pageshow', function(event) {
    if (event.persisted && video) {
      video.play();
    }
  });

  // täiendav kontroll
  window.addEventListener('focus', function() {
    if (video && video.paused) {
      video.play();
    }
  });
});