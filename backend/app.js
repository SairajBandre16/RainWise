const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Route to calculate area based on coordinates (using Google Maps API)
app.post('/api/v1/area', async (req, res) => {
    const { coordinates } = req.body;

    if (!coordinates || coordinates.length < 3) {
        return res.status(400).json({ message: 'At least 3 coordinates are required' });
    }

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0].lat},${coordinates[0].lng}&key=${GOOGLE_MAPS_API_KEY}`);

        if (response.data.status === 'OK') {
            return res.json({
                area: calculatePolygonArea(coordinates), // Use some formula to calculate area
                location: response.data.results[0].formatted_address,
            });
        } else {
            res.status(500).json({ message: 'Error fetching area data from Google Maps API' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

function calculatePolygonArea(coordinates) {
    // Radius of Earth in kilometers
    const R = 6371;
    
    let area = 0;
    const len = coordinates.length;

    for (let i = 0; i < len; i++) {
        const lat1 = degToRad(coordinates[i].lat);
        const lng1 = degToRad(coordinates[i].lng);
        const lat2 = degToRad(coordinates[(i + 1) % len].lat);
        const lng2 = degToRad(coordinates[(i + 1) % len].lng);

        area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = (area * R * R) / 2;

    return Math.abs(area); // Return absolute value in km²
}

// Helper function to convert degrees to radians
function degToRad(deg) {
    return deg * (Math.PI / 180);
}


// Rainfall Prediction (Mocked ML integration)
app.post('/api/v1/rainfall-prediction', (req, res) => {
    const { latitude, longitude, month } = req.body;

    if (!latitude || !longitude || !month) {
        return res.status(400).json({ message: 'Latitude, longitude, and month are required' });
    }

    // Mocked prediction
    const rainfallPrediction = Math.random() * 200; // Random rainfall value for now

    res.json({
        region: { latitude, longitude },
        month: month,
        predicted_rainfall: rainfallPrediction, // Mocked rainfall value
    });
});

// Water Demand Forecasting (Mocked Deep Learning integration)
app.post('/api/v1/water-demand', (req, res) => {
    const { population, area_size } = req.body;

    if (!population || !area_size) {
        return res.status(400).json({ message: 'Population and area size are required' });
    }

    // Simple calculation (Replace with actual model prediction)
    const waterDemand = population * area_size * 0.05; // Mock calculation

    res.json({
        population: population,
        area_size: area_size,
        predicted_water_demand: waterDemand // Output of the model (mocked)
    });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
