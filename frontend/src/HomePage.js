import React, { useState } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import axios from 'axios';

const HomePage = () => {
  const [area, setArea] = useState(null);
  const [predictedRainfall, setPredictedRainfall] = useState(null);
  const [waterCapacity, setWaterCapacity] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateAreaAndWaterCapacity = async (coordinates) => {
    if (!coordinates || coordinates.length < 3) {
        alert('Please plot at least 3 points for a polygon');
        return;
    }

    setLoading(true);
    
    try {
        // Call backend to calculate area
        const areaResponse = await axios.post('http://localhost:5000/api/v1/area', { coordinates });
        const calculatedArea = areaResponse.data.area;

        // Call backend to predict rainfall (mocked)
        const rainfallResponse = await axios.post('http://localhost:5000/api/v1/rainfall-prediction', {
            latitude: coordinates[0].lat,
            longitude: coordinates[0].lng,
            month: new Date().getMonth() + 1, // Current month
        });
        const rainfall = rainfallResponse.data.predicted_rainfall;

        // Call backend to predict water demand (mocked)
        const waterCapacityResponse = await axios.post('http://localhost:5000/api/v1/water-demand', {
            population: 5000, // Replace with actual data if available
            area_size: calculatedArea, // Calculated area in km²
        });
        const capacity = waterCapacityResponse.data.predicted_water_demand;

        setArea(calculatedArea);
        setPredictedRainfall(rainfall);
        setWaterCapacity(capacity);
    } catch (error) {
        console.error('Error calculating area, rainfall, or water capacity:', error);
    }

    setLoading(false);
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 w-screen">
      <header className="flex items-center justify-between bg-blue-900 text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold">RainWise</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-lg hover:underline">Home</a></li>
            <li><a href="#" className="text-lg hover:underline">About</a></li>
            <li><a href="#" className="text-lg hover:underline">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="p-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-900">Welcome to RainWise</h2>
          <p className="text-lg text-blue-700">Plot your area on the map to calculate rainwater harvesting capacity.</p>
        </div>

        {/* Google Map and Calculation Section */}
        <div className="flex flex-col items-center justify-center">
          {/* Google Map */}
          <div className="w-full max-w-4xl h-100 mb-6 shadow-lg">
            <GoogleMapComponent calculateAreaAndWaterCapacity={calculateAreaAndWaterCapacity} />
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mt-8">
    {/* Area */}
    <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">Calculated Area</h3>
        <p className="text-lg text-gray-700">
            {loading ? 'Calculating...' : (area ? `${area.toFixed(2)} km²` : 'Area will be displayed here.')}
        </p>
    </div>

    {/* Predicted Rainfall */}
    <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">Predicted Rainfall</h3>
        <p className="text-lg text-gray-700">
            {loading ? 'Fetching...' : (predictedRainfall ? `${predictedRainfall.toFixed(2)} mm` : 'Rainfall data will be displayed here.')}
        </p>
    </div>

    {/* Water Capacity */}
    <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">Water Capacity</h3>
        <p className="text-lg text-gray-700">
            {loading ? 'Calculating...' : (waterCapacity ? `${waterCapacity.toFixed(2)} liters` : 'Water capacity will be displayed here.')}
        </p>
    </div>
</div>

      </main>

      <footer className="text-center p-4 bg-blue-900 text-white">
        <p>&copy; 2024 RainWise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

