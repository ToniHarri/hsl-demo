const finlandCenter = [65.0, 26.0]; // Approximate geographic center of Finland
const finlandZoom = 5; // Zoom level that fits most of Finland
const map = L.map('map').setView(finlandCenter, finlandZoom);

// Add CartoDB basemap with custom POIs
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);

// Try to get the user's current location and track movement
navigator.geolocation.watchPosition(updateUserLocation, (error) => {
    // If user denies location access or an error occurs, focus on a default location
    map.setView(finlandCenter, finlandZoom);
}, {
    enableHighAccuracy: true
});

// Define custom icons using Font Awesome
const createFontAwesomeMarkerIcon = (iconClass) => {
    return L.divIcon({
        html: `<i class="fa ${iconClass} fa-icon"></i>`,
        className: 'fa-icon-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
};

const userLocationIcon = createFontAwesomeMarkerIcon('fa-map-marker-alt');
const busStopIcon = createFontAwesomeMarkerIcon('fa-bus');
const tramStopIcon = createFontAwesomeMarkerIcon('fa-subway');  // Using subway icon for tram stops
const metroStationIcon = createFontAwesomeMarkerIcon('fa-train');
const otherPoiIcon = createFontAwesomeMarkerIcon('fa-map-marker');

// Function to handle selection of a location from the dropdown
function selectLocation() {
    const selectedLocation = document.getElementById('results-select').value;
    if (selectedLocation === '') return;

    // Location is in the format 'lat,lon'. Not pretty but works for now.
    const location = selectedLocation.split(',');

    const lat = location[0];
    const lon = location[1];

    // Center map to the selected location
    map.setView([lat, lon], 16);

    // Add a marker for the selected location
    L.marker([lat, lon], { icon: otherPoiIcon }).addTo(map).bindPopup('Selected Location').openPopup();

    // Fetch and display POIs
    fetchNearbyStops(lat, lon).then(stops => {
        stops.forEach(stop => {
            let icon;
            switch (stop.vehicleMode) {
                case 'BUS':
                    icon = busStopIcon;
                    break;
                case 'TRAM':
                    icon = tramStopIcon;
                    break;
                case 'SUBWAY':
                    icon = metroStationIcon;
                    break;
                default:
                    icon = null;
            }
            if (icon) {
                L.marker([stop.lat, stop.lon], { icon: icon })
                    .addTo(map)
                    .bindPopup(stop.name);
            }

        });
    });
}

// Function to update the user's location and heading
function updateUserLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const heading = position.coords.heading;

    if (!userMarker) {
        userMarker = L.marker([lat, lon], { icon: userLocationIcon }).addTo(map).bindPopup('Your Location');
    } else {
        userMarker.setLatLng([lat, lon]);
    }

    if (heading !== null) {
        if (!userDirectionMarker) {
            userDirectionMarker = L.marker([lat, lon], {
                icon: createFontAwesomeMarkerIcon('fa-location-arrow'),
                rotationAngle: heading
            }).addTo(map).bindPopup('Heading');
        } else {
            userDirectionMarker.setLatLng([lat, lon]);
            userDirectionMarker.setRotationAngle(heading);
        }
    }

    map.setView([lat, lon], 19);
}
