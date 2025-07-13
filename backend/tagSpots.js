import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// 🔁 Smarter tagging with shared experiences
function generateTags(name, type) {
  const tags = new Set();
  const lower = name.toLowerCase();

  // Universal tags
  tags.add('scenic');
  tags.add('photogenic');

  // Based on type and name keywords
  if (type === 'beach' || lower.includes('beach') || lower.includes('shore')) {
    tags.add('swimming');
    tags.add('sunny');
    tags.add('sand');
    tags.add('relaxing');
    tags.add('family-friendly');
    tags.add('picnic');
  }

  if (type === 'park' || lower.includes('park') || lower.includes('reserve')) {
    tags.add('family-friendly');
    tags.add('relaxing');
    tags.add('trees');
    tags.add('picnic');
    tags.add('quiet');
    tags.add('wildlife');
  }

  if (type === 'trail' || lower.includes('trail') || lower.includes('path')) {
    tags.add('hiking');
    tags.add('exercise');
    tags.add('scenic');
    tags.add('quiet');
    tags.add('wildlife');
  }

  if (lower.includes('lake')) {
    tags.add('lake');
    tags.add('fishing');
    tags.add('swimming');
    tags.add('relaxing');
  }

  if (lower.includes('boardwalk') || lower.includes('walk')) {
    tags.add('exercise');
    tags.add('photogenic');
  }

  return Array.from(tags);
}

async function tagAllSpots() {
  const { data: spots, error } = await supabase.from('spots').select('*');

  if (error) {
    console.error('❌ Failed to fetch spots:', error.message);
    return;
  }

  let updatedCount = 0;

  for (const spot of spots) {
    const tags = generateTags(spot.name, spot.type);

    const { error: updateError } = await supabase
      .from('spots')
      .update({ tags })
      .eq('id', spot.id);

    if (updateError) {
      console.error(`❌ Failed to update spot ID ${spot.id}:`, updateError.message);
    } else {
      console.log(`✅ Updated spot ID ${spot.id} with tags: [${tags.join(', ')}]`);
      updatedCount++;
    }
  }

  console.log(`\n🏁 Tagging complete. Updated ${updatedCount} spots.`);
}

tagAllSpots();
