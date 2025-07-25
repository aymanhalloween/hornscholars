const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function verifyMapFix() {
  console.log('🔍 Verifying map integration...')
  
  const { data: mapData } = await supabase
    .from('scholar_locations')
    .select(`
      *,
      scholars (name_english, birth_year),
      locations (name, latitude, longitude, country)
    `)
    .not('locations.latitude', 'is', null)

  console.log(`✅ ${mapData.length} scholars with mapped coordinates`)
  
  // Group by country
  const byCountry = {}
  mapData.forEach(item => {
    const country = item.locations.country
    if (!byCountry[country]) {
      byCountry[country] = []
    }
    byCountry[country].push(item)
  })

  console.log('📊 Scholars by country:')
  Object.entries(byCountry).forEach(([country, scholars]) => {
    console.log(`   • ${country}: ${scholars.length} scholars`)
  })

  // Show sample scholars
  console.log('\n🗺️  Sample scholars on map:')
  const uniqueScholars = new Set()
  mapData.forEach(item => {
    if (uniqueScholars.size < 10) {
      uniqueScholars.add(`${item.scholars.name_english} in ${item.locations.name}, ${item.locations.country}`)
    }
  })
  
  uniqueScholars.forEach(scholar => {
    console.log(`   • ${scholar}`)
  })

  console.log(`\n🎉 Map integration complete! ${new Set(mapData.map(item => item.scholars.name_english)).size} unique scholars are now on the map!`)
}

verifyMapFix()