const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Route to calculate area based on coordinates
app.post('/api/v1/area', (req, res) => {
    const { coordinates } = req.body;

    if (!coordinates || coordinates.length < 3) {
        return res.status(400).json({ message: 'At least 3 coordinates are required' });
    }

    try {
        const area = calculatePolygonArea(coordinates);

        res.json({
            area: area, // Use some formula to calculate area
            location: 'Location data not fetched' // No geocoding API call for now
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating area', error: error.message });
    }
});

function calculatePolygonArea(coordinates) {
    const R = 6371; // Radius of Earth in kilometers
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

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// Rainfall Prediction (Mocked ML integration)
app.post('/api/v1/rainfall-prediction', (req, res) => {
    const { latitude, longitude, month } = req.body;

    if (latitude === undefined || longitude === undefined || month === undefined) {
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

    if (population === undefined || area_size === undefined) {
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
