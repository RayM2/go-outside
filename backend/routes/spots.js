import express from 'express';

export default function(supabase) {
  const router = express.Router();

  // GET all spots
  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase.from('spots').select('*');

      if (error) {
        console.error('Error fetching spots:', error.message);
        return res.status(500).json({ error: 'Failed to fetch spots' });
      }

      res.json(data);
    } catch (err) {
      console.error('Unexpected error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST new spot
  router.post('/', async (req, res) => {
    const { name, type, location } = req.body;

    // Basic validation
    if (!name || !type || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { data, error } = await supabase
        .from('spots')
        .insert([{ name, type, location }])
        .select();

      if (error) {
        console.error('Error inserting spot:', error.message);
        return res.status(500).json({ error: 'Failed to add spot' });
      }

      res.status(201).json(data[0]);
    } catch (err) {
      console.error('Unexpected error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}
