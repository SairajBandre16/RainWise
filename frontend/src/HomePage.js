import React, { useState } from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';

const HomePage = () => {
  const [area, setArea] = useState(null);
  const [predictedRainfall, setPredictedRainfall] = useState(null);
  const [waterCapacity, setWaterCapacity] = useState(null);

  const calculateArea = () => {
    // Mock calculation; replace with actual calculation logic
    const calculatedArea = 1200; // Example area in sq. meters
    const rainfall = 50; // Example predicted rainfall in mm
    const capacity = 10000; // Example water capacity in liters

    setArea(calculatedArea);
    setPredictedRainfall(rainfall);
    setWaterCapacity(capacity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400">
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
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Welcome to RainWise</h2>
          <p className="text-lg text-blue-700">Plot your area on the map to calculate rainwater harvesting capacity.</p>
        </div>

        {/* Google Map and Calculation Section */}
        <div className="flex flex-col items-center justify-center">
          {/* Google Map */}
          <div className="w-full max-w-4xl h-96 mb-6 shadow-lg">
            <GoogleMapComponent />
          </div>

          {/* Calculation Button */}
          <button
            onClick={calculateArea}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg mb-6"
          >
            Calculate Area and Water Harvesting
          </button>
        </div>

        {/* Results Section */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mt-8">
          {/* Area */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Calculated Area</h3>
            <p className="text-lg text-gray-700">{area ? `${area} sq. meters` : 'Area will be displayed here.'}</p>
          </div>

          {/* Predicted Rainfall */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Predicted Rainfall</h3>
            <p className="text-lg text-gray-700">{predictedRainfall ? `${predictedRainfall} mm` : 'Rainfall data will be displayed here.'}</p>
          </div>

          {/* Water Capacity */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3">
            <h3 className="text-2xl font-semibold text-blue-900 mb-4">Water Capacity</h3>
            <p className="text-lg text-gray-700">{waterCapacity ? `${waterCapacity} liters` : 'Water capacity will be displayed here.'}</p>
          </div>
        </div>
      </main>

      <footer className="text-center p-4 bg-blue-900 text-white mt-8">
        <p>&copy; 2024 RainWise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
