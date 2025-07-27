import express from 'express';

/**
 * Expects Supabase client to be passed in when mounted in index.js
 */
export default function logsRouter(supabase) {
  const router = express.Router();

  // GET all logs
  router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('logs')
    .select('*, spot:spots (name, location, type)')  // alias for joined spot info
    .eq('visited', true);

  if (error) {
    console.error('Error fetching logs:', error.message);
    return res.status(500).json({ error: 'Failed to fetch logs' });
  }

  res.json(data);
});

  // POST a new log
  router.post('/', async (req, res) => {
    const { spot_id, visited, notes, rating } = req.body;

    if (!spot_id) {
      return res.status(400).json({ error: 'Missing spot_id' });
    }

    console.log('Attempting to insert:', { spot_id, visited, notes, rating });

const { data, error } = await supabase.from('spot_logs').insert([
  {
    spot_id,
    visited: visited ?? false,
    notes: notes ?? '',
    rating: rating ?? null
  }
]).select();

    if (error) {
      console.error('Error inserting log:', error.message);
      return res.status(500).json({ error: 'Failed to insert log' });
    }

    res.status(201).json(data[0]);
  });

  return router;
}
