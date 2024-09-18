import React, { useState } from 'react';
import { GoogleMap, Polygon, Marker, LoadScript } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '260px',
};

const center = {
  lat: 20.5937, // Initial center location (India)
  lng: 78.9629,
};

const libraries = ['drawing'];

const GoogleMapComponent = () => {
  const [polygon, setPolygon] = useState([]);
  const [areaDetails, setAreaDetails] = useState(null);
  const [rainfallDetails, setRainfallDetails] = useState(null);
  const [waterDemandDetails, setWaterDemandDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMapClick = (event) => {
    const newLatLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setPolygon((current) => [...current, newLatLng]);
  };

  const resetPolygon = () => {
    setPolygon([]);
    setAreaDetails(null);
    setRainfallDetails(null);
    setWaterDemandDetails(null);
  };

  const handleSubmit = async () => {
    if (polygon.length < 3) {
      alert('Please plot the polygon by selecting at least three corners.');
      return;
    }

    setLoading(true); 
    console.log(polygon);
    try {
      const areaResponse = await axios.post('http://localhost:5000/api/v1/area', {
        coordinates: polygon,
      });
      
      setAreaDetails(areaResponse.data);

      const rainfallResponse = await axios.post('http://localhost:5000/api/v1/rainfall-prediction', {
        latitude: center.lat,
        longitude: center.lng,
        month: new Date().getMonth() + 1, // current month
      });

      setRainfallDetails(rainfallResponse.data);

      const waterDemandResponse = await axios.post('http://localhost:5000/api/v1/water-demand', {
        population: 50000, // Mock data: replace with actual input
        area_size: areaResponse.data.area,
      });

      setWaterDemandDetails(waterDemandResponse.data);
    } catch (error) {
      console.error('Error submitting polygon:', error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-blue-600">RainWise: Plot Your Area</h1>
        <p className="text-gray-600">Click on the map to select the corners of your polygon.</p>
      </div>

      <div className="mb-6">
        <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_KEY} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={6}
            onClick={handleMapClick}
          >
            {polygon.length > 0 && (
              <Polygon
                paths={polygon}
                options={{
                  fillColor: '#2196F3',
                  fillOpacity: 0.4,
                  strokeColor: '#1976D2',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
            {polygon.map((corner, index) => (
              <Marker key={index} position={corner} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="flex justify-center space-x-4 mb-3">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          {loading ? 'Calculating...' : 'Submit Area'}
        </button>
        <button
          onClick={resetPolygon}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {areaDetails && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-700">Area Details</h2>
            <p className="text-gray-600 mt-2">
              <strong>Area Size:</strong> {areaDetails.area} km²
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong> {areaDetails.location}
            </p>
          </div>
        )}

        {rainfallDetails && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-700">Rainfall Prediction</h2>
            <p className="text-gray-600 mt-2">
              <strong>Predicted Rainfall:</strong> {rainfallDetails.predicted_rainfall} mm
            </p>
            <p className="text-gray-600">
              <strong>Month:</strong> {rainfallDetails.month}
            </p>
          </div>
        )}

        {waterDemandDetails && (
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-700">Water Demand Forecast</h2>
            <p className="text-gray-600 mt-2">
              <strong>Predicted Water Demand:</strong> {waterDemandDetails.predicted_water_demand} L
            </p>
            <p className="text-gray-600">
              <strong>Population:</strong> {waterDemandDetails.population}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapComponent;