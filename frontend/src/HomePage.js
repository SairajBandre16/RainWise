import React from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">RainWise</h1>
          <div className="space-x-6">
            <button className="text-white hover:text-gray-200">Home</button>
            <button className="text-white hover:text-gray-200">About</button>
            <button className="text-white hover:text-gray-200">Contact</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <GoogleMapComponent />
      </div>
    </div>
  );
};

export default HomePage;
