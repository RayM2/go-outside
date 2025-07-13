import { useState } from 'react';
import axios from 'axios';

function AddSpotForm({ onAdd }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !location) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/spots`, {
        name,
        type,
        location
      });
      onAdd?.(res.data); // Optional callback to update UI
      setName('');
      setType('');
      setLocation('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to add spot');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow w-full max-w-md mt-6">
      <h2 className="text-xl font-semibold">Add a New Spot</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Type (beach, park, etc)"
        value={type}
        onChange={e => setType(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Location (e.g., NJ)"
        value={location}
        onChange={e => setLocation(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Spot
      </button>
    </form>
  );
}

export default AddSpotForm;
