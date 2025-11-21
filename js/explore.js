async function loadCountries() {
  try {
    const res = await fetch('database/countries.json');  // adjust path if needed

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
