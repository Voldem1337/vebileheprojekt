document.addEventListener("DOMContentLoaded", () => {
    // Load liked countries from localStorage
    const liked = JSON.parse(localStorage.getItem("likedCountries")) || [];

    const container = document.getElementById("resultsContainer");

    if (liked.length === 0) {
        container.innerHTML = "<p>Sa ei ole veel ühtegi riiki lisanud.</p>";
        return;
    }

    // Render each liked country
    liked.forEach(country => {
        const card = document.createElement("div");
        card.className = "result-card";

        card.innerHTML = `
            <img src="${country.image}" alt="${country.name}">
            <h2>${country.name}</h2>
            <p>${country.description}</p>
        `;

        container.appendChild(card);
    });
});
