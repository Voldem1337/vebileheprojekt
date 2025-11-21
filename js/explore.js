async function loadGallery() {
  try {
    // Fetch the JSON file. Use the path relative to this HTML file:
    // in our example it's in `data/data.json`
    const res = await fetch('data/data.json');

    if (!res.ok) throw new Error(`Failed to load JSON (${res.status})`);

    // Keep the response URL so we can resolve relative image paths against it
    const baseForRelative = res.url; // <-- important

    const items = await res.json(); // expects an array of objects with {name, image}

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // clear

    items.forEach(item => {
      // If the JSON has relative paths (e.g. "images/a.jpg"), resolve them relative to the JSON file:
      const imageUrl = item.image
        ? new URL(item.image, baseForRelative).href
        : null;

      const card = document.createElement('div');
      card.className = 'card';

      // Image element
      const img = document.createElement('img');
      img.alt = item.name ?? 'image';
      img.loading = 'lazy';
      // set src or use placeholder
      if (imageUrl) img.src = imageUrl;
      else img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="20">No image</text></svg>');

      // fallback if image fails to load
      img.onerror = () => {
        img.onerror = null;
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="18">Image not found</text></svg>');
      };

      // Name
      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.textContent = item.name ?? 'Unnamed';

      card.appendChild(img);
      card.appendChild(nameEl);
      gallery.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading gallery', err);
    document.getElementById('gallery').textContent = 'Failed to load gallery.';
  }
}

// run on page load
document.addEventListener('DOMContentLoaded', loadGallery);
