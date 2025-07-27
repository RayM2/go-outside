import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Journal() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/logs`)
      .then(res => setLogs(res.data))
      .catch(err => console.error('Failed to fetch logs:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Outdoor Journal</h1>

      {logs.length === 0 ? (
        <p className="text-gray-500 text-center">You haven't visited any spots yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {logs.map(log => (
            <div key={log.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{log.spot.name}</h2>
              <p className="text-gray-600">{log.spot.type} — {log.spot.location}</p>
              <p className="mt-2 text-sm"><strong>Rating:</strong> {log.rating ?? 'N/A'}</p>
              <p className="mt-1 text-sm"><strong>Notes:</strong> {log.notes || 'No notes yet'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Journal;
