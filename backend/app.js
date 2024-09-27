const express = require('express');
const cors = require('cors');
const turf = require('@turf/turf');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' // Allow only this origin
}));
app.post('/api/v1/calculate', (req, res) => {
    const { coordinates, population } = req.body;

    if (!coordinates || coordinates.length < 3) {
        return res.status(400).json({ message: 'At least 3 coordinates are required' });
    }

    // Create a polygon from the coordinates
    const polygon = turf.polygon([coordinates.map(coord => [coord.lng, coord.lat])]);

    // Calculate area in square meters
    const area = turf.area(polygon); // Area in square meters

    // Convert area from square meters to square kilometers
   // const areaInKm2 = area / 1000000;

    // Get coordinates for the center of the polygon
    const center = turf.center(polygon).geometry.coordinates;

    // Call Flask API to get predicted rainfall
    axios.post('http://127.0.0.1:5001/predict_rainfall', {
        lat: center[1],  // Latitude
        lon: center[0]   // Longitude
    })
    .then(flaskResponse => {
        const predictedRainfall = parseFloat(flaskResponse.data.predicted_rainfall); // Parse the rainfall prediction

        // Predict Water Demand
        const waterDemand = (predictedRainfall * area) / population; 

        res.json({
            area: area, // Area in m²
            predicted_rainfall: predictedRainfall,
            predicted_water_demand: waterDemand
        });
    })
    .catch(error => {
        console.error('Error fetching rainfall:', error);
        res.status(500).json({ message: 'Error fetching rainfall', error: error.message });
    });
});



// Start your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
