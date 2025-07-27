import express from 'express';
const router = express.Router();

export default function(supabase) {
  // GET all spots
  router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('spots').select('*');
    if (error) return res.status(500).json({ error: 'Failed to fetch spots' });
    res.json(data);
  });

  // POST new spot
  router.post('/', async (req, res) => {
    const { name, type, location } = req.body;
    if (!name || !type || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const { data, error } = await supabase
      .from('spots')
      .insert([{ name, type, location }])
      .select();
    if (error) return res.status(500).json({ error: 'Failed to add spot' });
    res.status(201).json(data[0]);
  });



  return router;
}
