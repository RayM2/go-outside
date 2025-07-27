import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterBar from '../components/filterBar';

function Home() {
  const [spots, setSpots] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [logData, setLogData] = useState({ visited: false, rating: '', notes: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/spots`)
      .then(res => setSpots(res.data));
    axios.get(`${import.meta.env.VITE_API_URL}/api/logs`)
      .then(res => setLogs(res.data));
  }, []);

  const openModal = (spot) => {
    setSelectedSpot(spot);
    const existingLog = logs.find(log => log.spot_id === spot.id);
    if (existingLog) {
      setLogData({ visited: existingLog.visited, rating: existingLog.rating, notes: existingLog.notes });
    } else {
      setLogData({ visited: false, rating: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveLog = async () => {
    const payload = {
      spot_id: selectedSpot.id,
      visited: logData.visited,
      rating: logData.rating,
      notes: logData.notes
    };

    if (logs.find(log => log.spot_id === selectedSpot.id)) {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/logs/${logs.find(log => log.spot_id === selectedSpot.id).id}`, payload);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logs`, payload);
    }

    // Update logs locally for instant UI feedback
    setLogs(prev => {
      const existing = prev.find(log => log.spot_id === selectedSpot.id);
      if (existing) {
        return prev.map(log => log.spot_id === selectedSpot.id ? { ...log, ...payload } : log);
      }
      return [...prev, { id: Date.now(), ...payload }];
    });

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Go Outside!</h1>

      {/* Spots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {spots.map(spot => (
          <div
            key={spot.id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => openModal(spot)}
          >
            <h2 className="text-xl font-semibold">{spot.name}</h2>
            <p className="text-gray-600">{spot.type} — {spot.location}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {spot.tags?.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300"
    style={{ animation: 'fadeIn 0.3s ease-out' }}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-300 scale-95"
      style={{ animation: 'scaleUp 0.3s ease-out' }}
    >
      <h2 className="text-2xl font-bold mb-2">{selectedSpot.name}</h2>
      <p className="text-gray-600 mb-4">{selectedSpot.type} — {selectedSpot.location}</p>

      {/* Visited Checkbox */}
      <label className="block mb-4">
        <input
          type="checkbox"
          checked={logData.visited}
          onChange={(e) => setLogData({ ...logData, visited: e.target.checked })}
          className="mr-2"
        />
        <span>Visited</span>
      </label>

      {/* Rating (disabled if not visited) */}
      <label className="block mb-2">Rating:</label>
      <input
        type="number"
        min="1"
        max="5"
        value={logData.rating}
        disabled={!logData.visited}
        onChange={(e) => setLogData({ ...logData, rating: e.target.value })}
        className={`border rounded w-full p-2 mb-4 ${!logData.visited ? 'opacity-50 cursor-not-allowed' : ''}`}
      />

      {/* Notes (disabled if not visited) */}
      <label className="block mb-2">Notes:</label>
      <textarea
        value={logData.notes}
        disabled={!logData.visited}
        onChange={(e) => setLogData({ ...logData, notes: e.target.value })}
        className={`border rounded w-full p-2 mb-4 ${!logData.visited ? 'opacity-50 cursor-not-allowed' : ''}`}
      />

      <div className="flex justify-between">
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveLog}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          disabled={!logData.visited}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Home;
