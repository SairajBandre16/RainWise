import React, { useState, useCallback } from 'react';
import { GoogleMap, Polygon, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 19.0330,
  lng: 73.0297,
};

const libraries = ['drawing'];

const GoogleMapComponent = ({ calculateAreaAndWaterCapacity }) => {
  const [polygon, setPolygon] = useState([]);

  // Handle click event to add markers and create a polygon
  const handleMapClick = useCallback((event) => {
    const newLatLng = { lng: event.latLng.lng(), lat: event.latLng.lat()};
    setPolygon((prevPolygon) => [...prevPolygon, newLatLng]);
  }, []);

  // Handle submit event to trigger area and water capacity calculation
  const handleSubmit = () => {
    if (polygon.length < 3) {
      alert('Please plot at least 3 points for a polygon.');
      return;
    }
    calculateAreaAndWaterCapacity(polygon);
  };

  // Handle reset event to clear the polygon
  const handleReset = () => {
    setPolygon([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_KEY} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={8}
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

      {/* Centering both buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg"
        >
          Submit Area
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
