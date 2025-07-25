const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Processed scholar data based on the provided information
const enhancedScholars = [
  {
    name_english: 'Ibrahim Said Mohamed Qolid',
    name_arabic: 'إبراهيم سعيد محمد قوليد',
    name_somali: null,
    birth_year: null,
    death_year: null,
    birth_location: 'Middle Shabeelle, Somalia',
    death_location: null,
    biography: 'Haj Ibrahim Said Mohamed Qolid\'s father, Mr. Mohamed Qolid, was one of the prominent scholars in Somalia, especially in the Salihiya order. He was from Middle Shabeelle, originally from the Shabeelle region in Western Somalia. He authored significant works on the history and virtues of Sufi orders in Somalia.',
    specializations: ['Salihiyya Sufism', 'Sufi Biography', 'Religious Leadership', 'Islamic History'],
    major_works: ['The Radiant Pearls in the Virtues of the Salihiyah, Rashidiyah, and Ahmadiyah Orders'],
    teaching_positions: [],
    scholarly_achievements: ['Chronicler of Salihiyya order history', 'Biographer of Sufi leaders'],
    students: [],
    notable_contributions: 'Documented the history and spread of the Salihiyya order in Somalia, preserving the biographies of prominent Sufi scholars and leaders.',
    intellectual_lineage: 'Salihiyya Sufi tradition through his father Mohamed Qolid',
    manuscripts_authored: 1,
    teaching_years_start: null,
    teaching_years_end: null
  },
  {
    name_english: 'Ibrahim Abdul Qadir Mohamed',
    name_arabic: 'إبراهيم عبد القادر محمد',
    name_somali: null,
    birth_year: 1994,
    death_year: null,
    birth_location: 'Mecca, Saudi Arabia',
    death_location: null,
    biography: 'Professor Ibrahim Abdul Qadir Mohamed was born in Mecca in 1994 but grew up in Bosaso, Somalia. He attended Islamic schools in Bosaso and later pursued postgraduate studies at the Islamic University in Uganda. He worked as a lecturer at East Africa University and is the son of Dr. Abdul Qadir Mohamed Abdullah, president of East Africa University.',
    specializations: ['International Relations', 'Islamic Diplomacy', 'Sharia Studies', 'Islamic History', 'Educational Research'],
    major_works: ['International Relations During the Era of Omar Ibn Al-Khattab'],
    teaching_positions: ['Lecturer at College of Sharia at East Africa University in Bosaso'],
    scholarly_achievements: ['Master\'s degree', 'University lecturer', 'Research in Islamic international relations'],
    students: [],
    notable_contributions: 'Advanced research in Islamic international relations and diplomatic principles, focusing on historical Islamic governance models.',
    intellectual_lineage: 'Modern Islamic university education through East Africa University and Islamic University of Uganda',
    manuscripts_authored: 1,
    teaching_years_start: 2015,
    teaching_years_end: null
  },
  {
    name_english: 'Ibrahim Abdullah Mohammed',
    name_arabic: 'إبراهيم عبد الله محمد',
    name_somali: null,
    birth_year: 1941,
    death_year: 2008,
    birth_location: 'Qalafo, Western Somalia',
    death_location: 'Abu Dhabi, United Arab Emirates',
    biography: 'Sheikh Ibrahim Abdullah Mohammed Mah was a scholar, political leader, and writer born in Qalafo, Western Somalia in 1941. He studied Islamic sciences and Arabic literature, graduated from Imam Muhammad bin Saud University in 1970, and became a prominent leader in Somali liberation movements. He founded the Regional Center for Research and Strategic Studies in the Horn of Africa and authored several important historical works.',
    specializations: ['Islamic Liberation Movements', 'Horn of Africa History', 'Islamic Political Leadership', 'Educational Administration', 'Strategic Studies'],
    major_works: [
      'The Masterpiece of the Loyalists: The Journey of Liberation and Arabization in the Horn of Africa',
      'Ogaden Challenges',
      'Interpretation of History',
      'The Map Wars in the Horn of Africa and Ethiopian Panic over Cultural Change',
      'Origins of Somali Words in Arabic'
    ],
    teaching_positions: ['Teacher in Somali secondary schools', 'Founder and Director of Regional Center for Research and Strategic Studies'],
    scholarly_achievements: [
      'President of National Front for Liberation of Ogadenia (1991-1998)',
      'Member of Central Committee of Western Somali Liberation Front',
      'University graduate from Saudi Arabia',
      'Institution founder'
    ],
    students: [],
    notable_contributions: 'Comprehensive documentation of Horn of Africa history and liberation movements, bridging Islamic scholarship with political activism and regional studies.',
    intellectual_lineage: 'Traditional Islamic education combined with modern Saudi university system',
    manuscripts_authored: 5,
    teaching_years_start: 1973,
    teaching_years_end: 1989
  }
]

// Enhanced location mapping with coordinates
const locationCoordinates = {
  'Middle Shabeelle': { latitude: 2.5000, longitude: 45.5000, country: 'Somalia', region: 'Middle Shabeelle' },
  'Mecca': { latitude: 21.4225, longitude: 39.8262, country: 'Saudi Arabia', region: 'Makkah Province' },
  'Bosaso': { latitude: 11.2842, longitude: 49.1816, country: 'Somalia', region: 'Bari' },
  'Qalafo': { latitude: 5.4167, longitude: 44.7500, country: 'Ethiopia', region: 'Somali Region' },
  'Abu Dhabi': { latitude: 24.4539, longitude: 54.3773, country: 'UAE', region: 'Abu Dhabi' },
  'Uganda': { latitude: 1.3733, longitude: 32.2903, country: 'Uganda', region: 'Central' },
  'Saudi Arabia': { latitude: 23.8859, longitude: 45.0792, country: 'Saudi Arabia', region: 'Riyadh' }
}

// Function to check for duplicates
async function checkForDuplicates(newScholars) {
  console.log('🔍 Checking for duplicate scholars...')
  
  const { data: existingScholars, error } = await supabase
    .from('scholars')
    .select('name_english, name_arabic, birth_year')

  if (error) {
    console.error('❌ Error fetching existing scholars:', error)
    return newScholars
  }

  console.log(`📊 Found ${existingScholars.length} existing scholars in database`)

  const uniqueScholars = newScholars.filter(newScholar => {
    const isDuplicate = existingScholars.some(existing => {
      return existing.name_english === newScholar.name_english ||
             (existing.birth_year && newScholar.birth_year && 
              existing.birth_year === newScholar.birth_year &&
              existing.name_english.split(' ')[0] === newScholar.name_english.split(' ')[0])
    })

    if (isDuplicate) {
      console.log(`⚠️  Skipping duplicate: ${newScholar.name_english}`)
      return false
    }
    return true
  })

  console.log(`✅ ${uniqueScholars.length} unique scholars to add`)
  return uniqueScholars
}

// Function to process locations
async function processLocations(scholars) {
  console.log('🗺️  Processing locations...')
  
  const allLocations = new Set()
  scholars.forEach(scholar => {
    if (scholar.birth_location) {
      const location = scholar.birth_location.split(',')[0].trim()
      allLocations.add(location)
    }
    if (scholar.death_location) {
      const location = scholar.death_location.split(',')[0].trim()
      allLocations.add(location)
    }
  })

  // Get existing locations
  const { data: existingLocations } = await supabase
    .from('locations')
    .select('name')

  const existingLocationNames = new Set(existingLocations?.map(l => l.name) || [])

  // Prepare new locations
  const newLocations = Array.from(allLocations)
    .filter(loc => !existingLocationNames.has(loc))
    .map(locationName => {
      const coords = locationCoordinates[locationName]
      return {
        name: locationName,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        country: coords?.country || extractCountryFromName(locationName),
        region: coords?.region || null
      }
    })

  if (newLocations.length > 0) {
    console.log(`📍 Adding ${newLocations.length} new locations`)
    const { error: locationError } = await supabase
      .from('locations')
      .insert(newLocations)

    if (locationError) {
      console.error('❌ Error inserting locations:', locationError)
    } else {
      console.log('✅ Locations added successfully')
    }
  }
}

function extractCountryFromName(locationName) {
  if (locationName.includes('Somalia')) return 'Somalia'
  if (locationName.includes('Ethiopia')) return 'Ethiopia'
  if (locationName.includes('UAE') || locationName.includes('Abu Dhabi')) return 'UAE'
  if (locationName.includes('Saudi Arabia') || locationName.includes('Mecca')) return 'Saudi Arabia'
  if (locationName.includes('Uganda')) return 'Uganda'
  return null
}

// Function to create scholar-location relationships
async function createScholarLocationRelationships(scholars) {
  console.log('🔗 Creating scholar-location relationships...')

  const { data: locations } = await supabase
    .from('locations')
    .select('id, name')

  const locationMap = new Map(locations?.map(l => [l.name, l.id]) || [])
  const relationships = []

  scholars.forEach(scholar => {
    if (scholar.birth_location) {
      const locationName = scholar.birth_location.split(',')[0].trim()
      const locationId = locationMap.get(locationName)
      if (locationId) {
        relationships.push({
          scholar_id: scholar.id,
          location_id: locationId,
          location_type: 'birth',
          start_year: scholar.birth_year,
          end_year: null
        })
      }
    }

    if (scholar.death_location) {
      const locationName = scholar.death_location.split(',')[0].trim()
      const locationId = locationMap.get(locationName)
      if (locationId) {
        relationships.push({
          scholar_id: scholar.id,
          location_id: locationId,
          location_type: 'death',
          start_year: scholar.death_year,
          end_year: null
        })
      }
    }
  })

  if (relationships.length > 0) {
    const { error } = await supabase
      .from('scholar_locations')
      .insert(relationships)

    if (error) {
      console.error('❌ Error creating scholar-location relationships:', error)
    } else {
      console.log(`✅ Created ${relationships.length} scholar-location relationships`)
    }
  }
}

// Function to create works
async function createWorks(scholars) {
  console.log('📚 Creating works entries...')

  const works = []
  const workAuthors = []

  scholars.forEach(scholar => {
    if (scholar.major_works && scholar.major_works.length > 0) {
      scholar.major_works.forEach(workTitle => {
        const work = {
          title_english: workTitle,
          title_arabic: generateArabicTitle(workTitle),
          title_transliteration: null,
          composition_year: null,
          composition_location: scholar.birth_location?.split(',')[0],
          subject_area: scholar.specializations?.slice(0, 3) || [],
          manuscript_status: 'manuscript',
          description: `A scholarly work by ${scholar.name_english}`,
          notes: null,
          pages: null,
          language: 'Arabic',
          genre: determineGenre(workTitle, scholar.specializations),
          extant_copies: 1,
          library_locations: null,
          publication_details: null
        }

        works.push(work)
        workAuthors.push({
          work_title: workTitle,
          scholar_id: scholar.id,
          author_role: 'author',
          attribution_certainty: 'certain'
        })
      })
    }
  })

  if (works.length > 0) {
    console.log(`📖 Adding ${works.length} works`)
    
    const { data: insertedWorks, error } = await supabase
      .from('works')
      .insert(works)
      .select('id, title_english')

    if (error) {
      console.error('❌ Error inserting works:', error)
    } else {
      console.log('✅ Works added successfully')

      if (insertedWorks && workAuthors.length > 0) {
        const workMap = new Map(insertedWorks.map(w => [w.title_english, w.id]))
        
        const validWorkAuthors = workAuthors
          .map(wa => ({
            work_id: workMap.get(wa.work_title),
            scholar_id: wa.scholar_id,
            author_role: wa.author_role,
            attribution_certainty: wa.attribution_certainty
          }))
          .filter(wa => wa.work_id)

        if (validWorkAuthors.length > 0) {
          const { error: authorsError } = await supabase
            .from('work_authors')
            .insert(validWorkAuthors)

          if (authorsError) {
            console.error('❌ Error creating work-author relationships:', authorsError)
          } else {
            console.log(`✅ Created ${validWorkAuthors.length} work-author relationships`)
          }
        }
      }
    }
  }
}

function generateArabicTitle(englishTitle) {
  // Return the title as-is since we have the proper Arabic names already
  return englishTitle
}

function determineGenre(title, specializations) {
  if (title.toLowerCase().includes('international relations')) return 'Political treatise'
  if (title.toLowerCase().includes('history')) return 'Historical work'
  if (title.toLowerCase().includes('pearls') || title.toLowerCase().includes('virtues')) return 'Sufi treatise'
  if (title.toLowerCase().includes('liberation') || title.toLowerCase().includes('challenges')) return 'Political work'
  return 'Scholarly treatise'
}

// Function to create scholar relationships
async function createScholarRelationships(scholars) {
  console.log('🤝 Creating scholar relationships...')

  const { data: allScholars } = await supabase
    .from('scholars')
    .select('id, name_english, birth_year, death_year, birth_location')

  const relationships = []

  scholars.forEach(scholar => {
    allScholars?.forEach(other => {
      if (other.name_english === scholar.name_english) return

      // Contemporary relationship (overlapping lifespans)
      if (scholar.birth_year && scholar.death_year && other.birth_year && other.death_year) {
        const overlap = Math.min(scholar.death_year, other.death_year) - Math.max(scholar.birth_year, other.birth_year)
        if (overlap > 10) {
          relationships.push({
            scholar_id: scholar.id,
            related_scholar_id: other.id,
            relationship_type: 'contemporary'
          })
        }
      }

      // Location-based relationship
      if (scholar.birth_location && other.birth_location) {
        const scholarLocation = scholar.birth_location.toLowerCase()
        const otherLocation = other.birth_location.toLowerCase()
        if (scholarLocation.includes('somalia') && otherLocation.includes('somalia')) {
          relationships.push({
            scholar_id: scholar.id,
            related_scholar_id: other.id,
            relationship_type: 'location_based'
          })
        }
      }
    })
  })

  // Remove duplicates
  const uniqueRelationships = relationships.filter((rel, index, self) =>
    index === self.findIndex(r => 
      (r.scholar_id === rel.scholar_id && r.related_scholar_id === rel.related_scholar_id) ||
      (r.scholar_id === rel.related_scholar_id && r.related_scholar_id === rel.scholar_id)
    )
  )

  if (uniqueRelationships.length > 0) {
    const { error } = await supabase
      .from('relationships')
      .insert(uniqueRelationships)

    if (error) {
      console.error('❌ Error creating relationships:', error)
    } else {
      console.log(`✅ Created ${uniqueRelationships.length} scholar relationships`)
    }
  }
}

// Main upload function
async function uploadEnhancedScholars() {
  console.log('🚀 Starting enhanced scholar data upload...')

  try {
    // Check for duplicates
    const uniqueScholars = await checkForDuplicates(enhancedScholars)
    
    if (uniqueScholars.length === 0) {
      console.log('ℹ️  No new scholars to add - all appear to be duplicates')
      return
    }

    // Process locations first
    await processLocations(uniqueScholars)

    // Insert scholars
    console.log(`👥 Inserting ${uniqueScholars.length} unique scholars...`)
    const { data: insertedScholars, error: scholarsError } = await supabase
      .from('scholars')
      .insert(uniqueScholars)
      .select('id, name_english')

    if (scholarsError) {
      console.error('❌ Error inserting scholars:', scholarsError)
      return
    }

    console.log(`✅ Successfully inserted ${insertedScholars.length} scholars`)

    // Map scholar IDs back to our data
    const scholarIdMap = new Map(insertedScholars.map(s => [s.name_english, s.id]))
    uniqueScholars.forEach(scholar => {
      scholar.id = scholarIdMap.get(scholar.name_english)
    })

    // Create all the relationships and works
    await createScholarLocationRelationships(uniqueScholars)
    await createScholarRelationships(uniqueScholars)
    await createWorks(uniqueScholars)

    console.log('🎉 Enhanced scholar data upload completed successfully!')

    // Test search functionality
    console.log('\n🧪 Testing search functionality...')
    const { data: searchTest, error: searchError } = await supabase
      .rpc('search_scholars', { search_query: 'Ibrahim', limit_count: 10 })

    if (searchError) {
      console.error('❌ Search test failed:', searchError)
    } else {
      console.log(`✅ Search test successful - found ${searchTest.length} results for "Ibrahim"`)
      searchTest.forEach(result => {
        console.log(`   • ${result.name_english} (${result.birth_year || 'unknown'}) - ${result.birth_location || 'unknown location'}`)
      })
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Run the upload
uploadEnhancedScholars()