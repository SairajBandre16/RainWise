import React, { useState } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';
import axios from 'axios';

const HomePage = () => {
  const [area, setArea] = useState(null);
  const [predictedRainfall, setPredictedRainfall] = useState(null);
  const [waterCapacity, setWaterCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [population, setPopulation] = useState(5000); // Default value

  const calculateAreaAndWaterCapacity = async (coordinates) => {
    if (!coordinates || coordinates.length < 3) {
      alert('Please plot at least 3 points for a polygon');
      return;
    }
  
    // Ensure the polygon is closed
    if (coordinates[0].lat !== coordinates[coordinates.length - 1].lat ||
        coordinates[0].lng !== coordinates[coordinates.length - 1].lng) {
      coordinates.push({ lng: coordinates[0].lng,lat: coordinates[0].lat }); // Closing the polygon
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/v1/calculate', { coordinates, population });
      const { area, predicted_rainfall, predicted_water_demand } = response.data;
      console.log(coordinates);
      console.log(response.data);
      setArea(typeof area === 'number' ? area : null);
      setPredictedRainfall(predicted_rainfall);
      setWaterCapacity(predicted_water_demand);
    } catch (error) {
      console.error('Error calculating area, rainfall, or water capacity:', error.response ? error.response.data : error.message);
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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-900">Welcome to RainWise</h2>
          <p className="text-lg text-blue-700">Plot your area on the map to calculate rainwater harvesting capacity.</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl h-100 mb-6 shadow-lg">
            <GoogleMapComponent calculateAreaAndWaterCapacity={calculateAreaAndWaterCapacity} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Calculated Area</h3>
            <p className="text-lg text-gray-700">
              {loading ? 'Calculating...' : (area !== null ? `${area.toFixed(2)} km²` : 'Area will be displayed here.')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Predicted Rainfall</h3>
            <p className="text-lg text-gray-700">
              {loading ? 'Fetching...' : (predictedRainfall !== null ? `${predictedRainfall.toFixed(2)} mm` : 'Rainfall data will be displayed here.')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Water Capacity</h3>
            <p className="text-lg text-gray-700">
              {loading ? 'Calculating...' : (waterCapacity !== null ? `${waterCapacity.toFixed(2)} liters` : 'Water capacity will be displayed here.')}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <input
            type="number"
            value={population}
            onChange={(e) => setPopulation(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter population"
          />
        </div>
      </main>

      <footer className="text-center p-4 bg-blue-900 text-white">
        <p>&copy; 2024 RainWise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
