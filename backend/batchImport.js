import axios from 'axios';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


// Delay helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Bounding boxes: [lon1, lat1, lon2, lat2]
const regions = [
  { name: 'North NJ', box: [-74.6, 41.1, -73.7, 40.8] },
  { name: 'Central NJ', box: [-75.0, 40.4, -73.8, 40.0] },
  { name: 'South NJ', box: [-75.3, 40.0, -74.2, 38.9] },
  { name: 'Eastern PA', box: [-75.4, 41.0, -74.5, 40.1] },
  { name: 'Lower NY', box: [-74.3, 41.1, -73.5, 40.5] }
];

// Keywords to search
const keywords = ['park', 'trail', 'beach'];

async function fetchAndInsert(keyword, region) {
  const [lon1, lat1, lon2, lat2] = region.box;

  console.log(`🔍 Fetching "${keyword}" in ${region.name}...`);

  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: keyword,
        format: 'json',
        viewbox: `${lon1},${lat1},${lon2},${lat2}`,
        bounded: 1,
        limit: 50
      },
      headers: {
        'User-Agent': 'go-outside-app/1.0'
      }
    });

    const locations = res.data.map((item) => ({
      name: item.display_name.split(',')[0],
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: keyword,
      location: region.name,
      description: '',
      image_url: '',
      best_time: ''
    }));

    for (const spot of locations) {
      // Avoid duplicates by checking name + lat + lng
      const { data: existing, error: fetchErr } = await supabase
        .from('spots')
        .select('id')
        .eq('name', spot.name)
        .eq('lat', spot.lat)
        .eq('lng', spot.lng)
        .maybeSingle();

      if (fetchErr) {
        console.error('Fetch error:', fetchErr.message);
        continue;
      }

      if (!existing) {
        const { error: insertErr } = await supabase
          .from('spots')
          .insert([spot]);

        if (insertErr) {
          console.error(`❌ Insert error for ${spot.name}:`, insertErr.message);
        } else {
          console.log(`✅ Inserted: ${spot.name}`);
        }

        await sleep(1000); // throttle per insertion
      } else {
        console.log(`⚠️ Skipped duplicate: ${spot.name}`);
      }
    }

  } catch (err) {
    console.error(`❌ Failed for ${keyword} in ${region.name}:`, err.message);
  }
}

async function runBatchImport() {
  for (const keyword of keywords) {
    for (const region of regions) {
      await fetchAndInsert(keyword, region);
      await sleep(1500); // throttle between each region search
    }
  }

  console.log('🎉 Import complete!');
}

runBatchImport();
