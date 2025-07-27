import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import spotsRouter from './routes/spots.js';
import osmRouter from './routes/osm.js';
import logsRouter from './routes/logs.js';



dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working');
});

app.use('/api/spots', spotsRouter(supabase));
app.use('/api', osmRouter(supabase));

app.use('/api/spots', spotsRouter(supabase));
app.use('/api/logs', logsRouter(supabase));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



