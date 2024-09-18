import React from 'react';
import HomePage from './HomePage';
function App() {
  return (
    <div className="bg-gray-100 py-0 px-0 overflow-y-hidden " style={{ maxHeight: '100vh' }}>
      <div className="container">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
