import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function updateAddresses() {
  // 1. Fetch all spots missing a specific location name (or all spots)
  const { data: spots, error } = await supabase
    .from('spots')
    .select('id, lat, lng')
    .eq('location', 'City of New York') // Only update spots originally marked as NY
    .order('id');

  if (error) {
    console.error('Error fetching spots:', error.message);
    return;
  }

  console.log(`Found ${spots.length} spots to update.`);

  // 2. Loop through each spot and update address
  for (const [index, spot] of spots.entries()) {
    if (!spot.lat || !spot.lng) {
      console.log(`Skipping spot ${spot.id} (missing coordinates)`);
      continue;
    }

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${spot.lat}&lon=${spot.lng}&format=json`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'GoOutsideApp/1.0 (your-email@example.com)' }
      });
      const json = await response.json();

      const address =
        json.address?.borough ||   // NYC boroughs like Brooklyn, Queens
        json.address?.suburb ||    // sometimes borough appears here
        json.address?.city ||      // default city
        json.address?.town ||
        json.address?.village ||
        json.address?.hamlet ||
        json.display_name;

      if (address) {
        console.log(`(${index + 1}/${spots.length}) Updating spot ${spot.id} → ${address}`);
        await supabase.from('spots').update({ location: address }).eq('id', spot.id);
      } else {
        console.log(`(${index + 1}/${spots.length}) No address found for spot ${spot.id}`);
      }
    } catch (err) {
      console.error(`Error updating spot ${spot.id}:`, err.message);
    }

    // Sleep to respect Nominatim rate limit (1 request/sec)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('✅ All spots updated!');
}

updateAddresses();
