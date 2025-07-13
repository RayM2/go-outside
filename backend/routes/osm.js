// routes/osm.js
import express from 'express';
import axios from 'axios';

export default function osmRoutes(supabase) {
  const router = express.Router();

  router.post('/import-osm', async (req, res) => {
    const { query = 'beach new jersey', type = 'beach', location = 'NJ', limit = 50 } = req.body;

    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit
        },
        headers: {
          'User-Agent': 'go-outside-app/1.0'
        }
      });

      const locations = response.data.map(item => ({
        name: item.display_name.split(',')[0],
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type,
        location,
        description: '',
        image_url: '',
        best_time: ''
      }));

      const { data, error } = await supabase
        .from('spots')
        .insert(locations)
        .select();

      if (error) {
        console.error('Insert error:', error.message);
        return res.status(500).json({ error: 'Failed to insert locations' });
      }

      res.status(201).json({ inserted: data.length });
    } catch (err) {
      console.error('OSM fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch from OSM' });
    }
  });

  return router;
}
