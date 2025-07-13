import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function importNamedBeaches() {
  const geojson = JSON.parse(fs.readFileSync('./routes/export.geojson', 'utf-8'));

  const namedFeatures = geojson.features.filter(
    feature => feature.geometry?.type === 'Point' && feature.properties?.name
  );

  const spots = namedFeatures.map(feature => ({
    name: feature.properties.name,
    type: 'beach',
    location: 'NJ',
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0]
  }));

  const { data, error } = await supabase
  .from('spots')
  .insert(spots)
  .select(); // <== this makes `data` contain the inserted rows

  if (error) {
    console.error('Insert error:', error.message);
  } else {
    console.log(`✅ Inserted ${data.length} named beaches`);
  }
}

importNamedBeaches();