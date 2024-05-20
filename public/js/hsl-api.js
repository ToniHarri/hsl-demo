async function fetchNearbyStops(lat, lon) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const response = await fetch(`${baseUrl}/api/digitransit/nearby-stops?lat=${lat}&lon=${lon}`);

    const data = await response.json();

    return data.stops;
}
