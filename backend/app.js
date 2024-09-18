const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAP_KEY;

const client = new Client({});

app.post('/api/v1/calculate', async (req, res) => {
    const { coordinates, population } = req.body;

    if (!coordinates || coordinates.length < 3) {
        return res.status(400).json({ message: 'At least 3 coordinates are required' });
    }

    try {
        // Calculate Area
        const polygonPath = coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));
        const polygonArea = calculatePolygonArea(polygonPath);

        // Predict Rainfall (Mocked)
        const predictedRainfall = Math.random() * 200; // Mocked value

        // Predict Water Demand
        const waterDemand = population * polygonArea * 0.05; // Mock calculation

        res.json({
            area: polygonArea, // Area in km²
            predicted_rainfall: predictedRainfall, // Mocked rainfall value
            predicted_water_demand: waterDemand // Mocked water demand value
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating area, rainfall, or water capacity', error: error.message });
    }
});

// Helper function to calculate polygon area using Google Maps API
// Helper function to calculate polygon area using Google Maps API
async function calculatePolygonArea(coordinates) {
    const google = require('@googlemaps/google-maps-services-js').Client;

    // Google Maps API requires the coordinates to be in a format that is valid for its functions
    const path = coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));

    try {
        // Google Maps API computes the area using spherical geometry
        const response = await client.distancematrix({
            params: {
                origins: path,
                destinations: path,
                key: GOOGLE_MAPS_API_KEY
            }
        });

        // Compute the area from the response data
        const area = response.data.rows.reduce((acc, row) => 
            acc + row.elements.reduce((sum, element) => sum + element.distance.value, 0), 0) / 1000000; // Convert m² to km²

        return area;
    } catch (error) {
        throw new Error('Error calculating area: ' + error.message);
    }
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
