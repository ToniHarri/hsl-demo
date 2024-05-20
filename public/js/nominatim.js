// Function to search location using Nominatim API
async function searchLocation() {
    const query = document.getElementById('search-input').value;
    if (!query) return;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?addressdetails=1&format=json&q=${query}`);
    const data = await response.json();

    const resultsSelect = document.getElementById('results-select');
    resultsSelect.innerHTML = '';
    searchResults = data;

    if (data && data.length > 0) {
        data.forEach((result, index) => {
            const option = document.createElement('option');
            // Store the lat and lon in the value of the option for ease of use.
            option.value = result.lat+','+result.lon;
            option.text = `${result.name}, ${result.address.city || result.address.town}, ${result.address.postcode}`;
            resultsSelect.appendChild(option);
        });

        resultsSelect.style.display = 'block';
    } else {
        alert('Location not found');
    }
}
