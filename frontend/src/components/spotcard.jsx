// SpotCard.jsx
import React from 'react';

function SpotCard({ spot, distance }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800">{spot.name}</h2>
      <p className="text-sm text-gray-600 capitalize">{spot.type} — {spot.location}</p>
      {spot.description && (
        <p className="mt-2 text-sm text-gray-700">
          {spot.description.length > 100 ? spot.description.slice(0, 100) + '…' : spot.description}
        </p>
      )}
      {distance && (
        <p className="mt-2 text-xs text-blue-500">~{distance.toFixed(1)} miles away</p>
      )}
    </div>
  );
}

export default SpotCard;
