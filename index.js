const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Check if .env.local exists and load it
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
}

const app = express();
const PORT = process.env.PORT;

// Use CORS to allow requests from frontend
app.use(cors());

const DIGITRANSIT_API_KEY = process.env.HSL_API_KEY;

// Load the frontend build from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fetch nearby stops from the Digitransit API
async function fetchNearbyStops(lat, lon) {
    const query = `
        {
            stopsByRadius(lat: ${lat}, lon: ${lon}, radius: 1000) {
                edges {
                    node {
                        stop {
                            name
                            lat
                            lon
                            vehicleMode
                        }
                    }
                }
            }
        }
    `;
    try {
        const response = await axios.post(
            'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
            query,
            {
                headers: {
                    'Content-Type': 'application/graphql',
                    'digitransit-subscription-key': DIGITRANSIT_API_KEY
                }
            }
        );
        return response.data.data.stopsByRadius.edges.map(edge => edge.node.stop);
    } catch (error) {
        console.error('Error fetching data from Digitransit API:', error);
        throw error;
    }
}

// Local endpoint to get the nearby stops
app.get('/api/digitransit/nearby-stops', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'lat and lon are required query parameters.' });
    }

    try {
        const stops = await fetchNearbyStops(lat, lon);
        res.json({ stops });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from Digitransit API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
