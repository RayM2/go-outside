import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterBar from '../components/filterBar';

function Home() {
  const [spots, setSpots] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/spots`)
      .then(res => setSpots(res.data))
      .catch(err => console.error('Failed to fetch spots:', err));
  }, []);

  // Compute match percentages and sort by match %
const filteredSpotsWithMatch = selectedTags.length === 0
  ? spots.map(spot => ({ ...spot, matchPercent: null }))
  : spots
      .map(spot => {
        const matchedTags = spot.tags?.filter(tag => selectedTags.includes(tag)) || [];
        const matchPercent = selectedTags.length > 0
          ? Math.round((matchedTags.length / selectedTags.length) * 100)
          : null;
        return { ...spot, matchPercent };
      })
      .filter(spot => spot.matchPercent > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent);


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Go Outside!</h1>

      <FilterBar selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

      {selectedTags.length > 0 && (
        <button
          onClick={() => setSelectedTags([])}
          className="mb-4 px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSpotsWithMatch.map(spot => (
  <div key={spot.id} className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold">{spot.name}</h2>
    <p className="text-gray-600">{spot.type} — {spot.location}</p>

    {spot.matchPercent !== null && (
      <div className="mt-2">
        <p className="text-sm text-green-700">{spot.matchPercent}% tag match</p>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${spot.matchPercent}%` }}
          />
        </div>
      </div>
    )}

    <div className="flex flex-wrap gap-2 mt-3">
      {spot.tags?.map(tag => (
        <span
          key={tag}
          className={`px-2 py-1 text-xs rounded-full ${
            selectedTags.includes(tag)
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
))}
      </div>
    </div>
  );
}

export default Home;
