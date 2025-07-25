const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Comprehensive location coordinates for Horn of Africa and related regions
const locationCoordinates = {
  // Somalia locations
  'Hudur': { latitude: 4.1197, longitude: 43.8889, country: 'Somalia', region: 'Bakool' },
  'Mogadishu': { latitude: 2.0469, longitude: 45.3182, country: 'Somalia', region: 'Banaadir' },
  'Berbera': { latitude: 10.4396, longitude: 45.0143, country: 'Somalia', region: 'Woqooyi Galbeed' },
  'Zeila': { latitude: 11.3583, longitude: 43.4625, country: 'Somalia', region: 'Awdal' },
  'Bosaso': { latitude: 11.2842, longitude: 49.1816, country: 'Somalia', region: 'Bari' },
  'Middle Shabeelle': { latitude: 2.5000, longitude: 45.5000, country: 'Somalia', region: 'Middle Shabeelle' },
  'Middle Shabelle': { latitude: 2.5000, longitude: 45.5000, country: 'Somalia', region: 'Middle Shabeelle' },
  'Lower Shabelle': { latitude: 1.8000, longitude: 44.5000, country: 'Somalia', region: 'Lower Shabelle' },
  'Middle Juba': { latitude: 0.3500, longitude: 42.5500, country: 'Somalia', region: 'Middle Juba' },
  'Western Somalia': { latitude: 6.0000, longitude: 44.0000, country: 'Somalia', region: 'Western Somalia' },
  'Northern Somalia': { latitude: 9.5000, longitude: 48.0000, country: 'Somalia', region: 'Northern Somalia' },
  'Tughabur': { latitude: 7.5000, longitude: 45.0000, country: 'Somalia', region: 'Western Somalia' },
  'Afgoye': { latitude: 2.1390, longitude: 45.1212, country: 'Somalia', region: 'Lower Shabelle' },
  'Dafed': { latitude: 1.7000, longitude: 44.8000, country: 'Somalia', region: 'Lower Shabelle' },
  'Sanag': { latitude: 10.5000, longitude: 47.5000, country: 'Somalia', region: 'Sanag' },
  'Dameerka': { latitude: 0.5000, longitude: 42.3000, country: 'Somalia', region: 'Middle Juba' },
  'Somalia': { latitude: 5.1521, longitude: 46.1996, country: 'Somalia', region: 'Central Somalia' },

  // Ethiopia locations
  'Harar': { latitude: 9.3125, longitude: 42.1188, country: 'Ethiopia', region: 'Harari Region' },
  'Qalafo': { latitude: 5.4167, longitude: 44.7500, country: 'Ethiopia', region: 'Somali Region' },
  'Qalaf': { latitude: 5.4167, longitude: 44.7500, country: 'Ethiopia', region: 'Somali Region' },
  'Jigjiga': { latitude: 9.3497, longitude: 42.7948, country: 'Ethiopia', region: 'Somali Region' },
  'Dire Dawa': { latitude: 9.5938, longitude: 41.8547, country: 'Ethiopia', region: 'Dire Dawa' },

  // Kenya locations
  'Wajir': { latitude: 1.7471, longitude: 40.0572, country: 'Kenya', region: 'Northeastern' },
  'Nairobi': { latitude: -1.2921, longitude: 36.8219, country: 'Kenya', region: 'Nairobi' },
  'Mandera': { latitude: 3.9366, longitude: 41.8669, country: 'Kenya', region: 'Northeastern' },

  // Saudi Arabia locations
  'Mecca': { latitude: 21.4225, longitude: 39.8262, country: 'Saudi Arabia', region: 'Makkah Province' },
  'Medina': { latitude: 24.4683, longitude: 39.6142, country: 'Saudi Arabia', region: 'Al Madinah Province' },

  // Other locations
  'Abu Dhabi': { latitude: 24.4539, longitude: 54.3773, country: 'UAE', region: 'Abu Dhabi' },
  'Cairo': { latitude: 30.0444, longitude: 31.2357, country: 'Egypt', region: 'Cairo Governorate' },
  'Damascus': { latitude: 33.5138, longitude: 36.2765, country: 'Syria', region: 'Damascus Governorate' },
  'Baghdad': { latitude: 33.3128, longitude: 44.3615, country: 'Iraq', region: 'Baghdad Governorate' },
  'Djibouti': { latitude: 11.8251, longitude: 42.5903, country: 'Djibouti', region: 'Djibouti' },
  'Stockholm': { latitude: 59.3293, longitude: 18.0686, country: 'Sweden', region: 'Stockholm' },
  'Sudan': { latitude: 15.5007, longitude: 32.5599, country: 'Sudan', region: 'Khartoum' },
  'Uganda': { latitude: 1.3733, longitude: 32.2903, country: 'Uganda', region: 'Central' }
}

// Function to extract location name from full location string
function extractLocationName(fullLocation) {
  if (!fullLocation) return null
  
  // Handle cases like "Hudur, Somalia" -> "Hudur"
  // Or "Qalafo, Western Somalia" -> "Qalafo"
  // Or "Middle Shabeelle, Somalia" -> "Middle Shabeelle"
  
  const parts = fullLocation.split(',')
  let locationName = parts[0].trim()
  
  // Special cases for compound names
  if (locationName.includes('Middle') || locationName.includes('Lower') || locationName.includes('Western') || locationName.includes('Northern')) {
    // For "Middle Shabelle, Somalia" keep "Middle Shabelle"
    if (parts.length > 1 && !parts[1].trim().includes('Somalia')) {
      locationName = `${locationName} ${parts[1].trim()}`
    }
  }
  
  return locationName
}

async function fixMapLocations() {
  console.log('🗺️  Fixing map locations and scholar-location relationships...')
  console.log('=' .repeat(70))

  try {
    // Step 1: Get all scholars with birth/death locations
    const { data: scholars, error: scholarsError } = await supabase
      .from('scholars')
      .select('id, name_english, birth_location, death_location')

    if (scholarsError) {
      console.error('❌ Error fetching scholars:', scholarsError)
      return
    }

    console.log(`📊 Processing ${scholars.length} scholars...`)

    // Step 2: Collect all unique locations
    const allLocationStrings = new Set()
    scholars.forEach(scholar => {
      if (scholar.birth_location) allLocationStrings.add(scholar.birth_location)
      if (scholar.death_location) allLocationStrings.add(scholar.death_location)
    })

    console.log(`📍 Found ${allLocationStrings.size} unique location strings`)

    // Step 3: Extract and normalize location names
    const locationNames = new Set()
    Array.from(allLocationStrings).forEach(locStr => {
      const name = extractLocationName(locStr)
      if (name) locationNames.add(name)
    })

    console.log(`🏷️  Normalized to ${locationNames.size} unique location names`)

    // Step 4: Get existing locations
    const { data: existingLocations, error: locError } = await supabase
      .from('locations')
      .select('name, latitude, longitude')

    if (locError) {
      console.error('❌ Error fetching locations:', locError)
      return
    }

    const existingLocationNames = new Set(existingLocations.map(l => l.name))
    console.log(`💾 ${existingLocationNames.size} locations already exist in database`)

    // Step 5: Add missing locations
    const newLocations = []
    Array.from(locationNames).forEach(locName => {
      if (!existingLocationNames.has(locName)) {
        const coords = locationCoordinates[locName]
        if (coords) {
          newLocations.push({
            name: locName,
            latitude: coords.latitude,
            longitude: coords.longitude,
            country: coords.country,
            region: coords.region
          })
        } else {
          console.log(`⚠️  No coordinates found for: ${locName}`)
          // Add without coordinates - can be geocoded later
          newLocations.push({
            name: locName,
            latitude: null,
            longitude: null,
            country: inferCountry(locName),
            region: null
          })
        }
      }
    })

    if (newLocations.length > 0) {
      console.log(`➕ Adding ${newLocations.length} new locations...`)
      
      const { error: insertError } = await supabase
        .from('locations')
        .insert(newLocations)

      if (insertError) {
        console.error('❌ Error inserting locations:', insertError)
        return
      }

      console.log('✅ New locations added successfully')
    }

    // Step 6: Get updated locations list
    const { data: allLocations, error: allLocError } = await supabase
      .from('locations')
      .select('id, name')

    if (allLocError) {
      console.error('❌ Error fetching updated locations:', allLocError)
      return
    }

    const locationMap = new Map(allLocations.map(l => [l.name, l.id]))

    // Step 7: Create scholar-location relationships
    console.log(`🔗 Creating scholar-location relationships...`)

    // Get existing relationships to avoid duplicates
    const { data: existingRelationships } = await supabase
      .from('scholar_locations')
      .select('scholar_id, location_id, location_type')

    const existingRelKeys = new Set()
    if (existingRelationships) {
      existingRelationships.forEach(rel => {
        existingRelKeys.add(`${rel.scholar_id}-${rel.location_id}-${rel.location_type}`)
      })
    }

    const newRelationships = []
    let relationshipCount = 0

    scholars.forEach(scholar => {
      // Birth location relationship
      if (scholar.birth_location) {
        const birthLocationName = extractLocationName(scholar.birth_location)
        const locationId = locationMap.get(birthLocationName)
        
        if (locationId) {
          const relKey = `${scholar.id}-${locationId}-birth`
          if (!existingRelKeys.has(relKey)) {
            newRelationships.push({
              scholar_id: scholar.id,
              location_id: locationId,
              location_type: 'birth',
              start_year: null, // Could be extracted from scholar data
              end_year: null
            })
            relationshipCount++
          }
        }
      }

      // Death location relationship
      if (scholar.death_location) {
        const deathLocationName = extractLocationName(scholar.death_location)
        const locationId = locationMap.get(deathLocationName)
        
        if (locationId) {
          const relKey = `${scholar.id}-${locationId}-death`
          if (!existingRelKeys.has(relKey)) {
            newRelationships.push({
              scholar_id: scholar.id,
              location_id: locationId,
              location_type: 'death',
              start_year: null,
              end_year: null
            })
            relationshipCount++
          }
        }
      }
    })

    if (newRelationships.length > 0) {
      console.log(`➕ Adding ${newRelationships.length} new scholar-location relationships...`)
      
      const { error: relError } = await supabase
        .from('scholar_locations')
        .insert(newRelationships)

      if (relError) {
        console.error('❌ Error inserting relationships:', relError)
        return
      }

      console.log('✅ Scholar-location relationships created successfully')
    }

    // Step 8: Verify the results
    console.log('\n📊 Final Results:')
    
    const { data: finalLocations } = await supabase
      .from('locations')
      .select('name, latitude, longitude, country')
      .not('latitude', 'is', null)

    console.log(`📍 Locations with coordinates: ${finalLocations.length}`)

    const { data: finalRelationships } = await supabase
      .from('scholar_locations')
      .select(`
        *,
        scholars (name_english),
        locations (name, latitude, longitude)
      `)
      .not('locations.latitude', 'is', null)

    console.log(`🔗 Scholar-location relationships with coordinates: ${finalRelationships.length}`)
    console.log(`👥 Unique scholars on map: ${new Set(finalRelationships.map(r => r.scholars.name_english)).size}`)

    // Show sample of scholars now on the map
    console.log('\n🗺️  Sample scholars now appearing on the map:')
    const uniqueScholars = [...new Set(finalRelationships.map(r => r.scholars.name_english))]
    uniqueScholars.slice(0, 10).forEach(name => {
      const rel = finalRelationships.find(r => r.scholars.name_english === name)
      console.log(`   • ${name} in ${rel.locations.name}`)
    })

    console.log(`\n🎉 Map integration complete! ${uniqueScholars.length} scholars should now appear on the map.`)

  } catch (error) {
    console.error('💥 Error fixing map locations:', error)
  }
}

function inferCountry(locationName) {
  const name = locationName.toLowerCase()
  if (name.includes('somalia') || name === 'mogadishu' || name === 'berbera' || name === 'zeila') return 'Somalia'
  if (name.includes('ethiopia') || name === 'harar' || name === 'jigjiga') return 'Ethiopia'
  if (name.includes('kenya') || name === 'wajir' || name === 'nairobi' || name === 'mandera') return 'Kenya'
  if (name.includes('saudi') || name === 'mecca' || name === 'medina') return 'Saudi Arabia'
  if (name.includes('uae') || name === 'abu dhabi') return 'UAE'
  if (name === 'djibouti') return 'Djibouti'
  return null
}

// Run the fix
fixMapLocations()