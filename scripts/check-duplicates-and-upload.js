const { createClient } = require('@supabase/supabase-js')
const { parseScholars, rawScholarData, extractLocations } = require('./process-scholar-data.js')
require('dotenv').config({ path: '.env.local' })

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Function to check for duplicate scholars
async function checkForDuplicates(newScholars) {
  console.log('🔍 Checking for duplicate scholars...')
  
  // Get all existing scholars
  const { data: existingScholars, error } = await supabase
    .from('scholars')
    .select('name_english, name_arabic, birth_year')

  if (error) {
    console.error('❌ Error fetching existing scholars:', error)
    return newScholars
  }

  console.log(`📊 Found ${existingScholars.length} existing scholars in database`)

  // Filter out duplicates based on name similarity and birth year
  const uniqueScholars = newScholars.filter(newScholar => {
    const isDuplicate = existingScholars.some(existing => {
      // Check exact name match
      if (existing.name_english === newScholar.name_english) return true
      
      // Check name similarity (allowing for minor variations)
      const normalizedExisting = existing.name_english.toLowerCase().replace(/[^\w\s]/g, '')
      const normalizedNew = newScholar.name_english.toLowerCase().replace(/[^\w\s]/g, '')
      
      // If names are very similar and birth years match (if available)
      if (normalizedExisting === normalizedNew) return true
      
      // Check if it's the same person with different name format
      if (existing.birth_year && newScholar.birth_year && 
          existing.birth_year === newScholar.birth_year &&
          normalizedExisting.includes(normalizedNew.split(' ')[0]) &&
          normalizedExisting.includes(normalizedNew.split(' ')[1])) {
        return true
      }

      return false
    })

    if (isDuplicate) {
      console.log(`⚠️  Skipping duplicate: ${newScholar.name_english}`)
      return false
    }
    return true
  })

  console.log(`✅ ${uniqueScholars.length} unique scholars to add (${newScholars.length - uniqueScholars.length} duplicates found)`)
  return uniqueScholars
}

// Enhanced location mapping with coordinates
const locationCoordinates = {
  'Hudur': { latitude: 4.1197, longitude: 43.8889, country: 'Somalia', region: 'Bakool' },
  'Mogadishu': { latitude: 2.0469, longitude: 45.3182, country: 'Somalia', region: 'Banaadir' },
  'Wajir': { latitude: 1.7471, longitude: 40.0572, country: 'Kenya', region: 'Northeastern' },
  'Nairobi': { latitude: -1.2921, longitude: 36.8219, country: 'Kenya', region: 'Nairobi' },
  'Bosaso': { latitude: 11.2842, longitude: 49.1816, country: 'Somalia', region: 'Bari' },
  'Mecca': { latitude: 21.4225, longitude: 39.8262, country: 'Saudi Arabia', region: 'Makkah' },
  'Medina': { latitude: 24.4683, longitude: 39.6142, country: 'Saudi Arabia', region: 'Al Madinah' },
  'Qalaf': { latitude: 6.7667, longitude: 44.4000, country: 'Ethiopia', region: 'Somali Region' },
  'Tughabur': { latitude: 7.5000, longitude: 45.0000, country: 'Somalia', region: 'Western Somalia' },
  'Middle Shabeelle': { latitude: 2.5000, longitude: 45.5000, country: 'Somalia', region: 'Middle Shabeelle' },
  'Qabridahare': { latitude: 6.7333, longitude: 44.2000, country: 'Ethiopia', region: 'Somali Region' },
  'Stockholm': { latitude: 59.3293, longitude: 18.0686, country: 'Sweden', region: 'Stockholm' },
  'Abu Dhabi': { latitude: 24.4539, longitude: 54.3773, country: 'UAE', region: 'Abu Dhabi' },
  'Sudan': { latitude: 15.5007, longitude: 32.5599, country: 'Sudan', region: 'Khartoum' },
  'Uganda': { latitude: 1.3733, longitude: 32.2903, country: 'Uganda', region: 'Central' }
}

// Function to process and add locations
async function processLocations(scholars) {
  console.log('🗺️  Processing locations...')
  
  const allLocations = new Set()
  scholars.forEach(scholar => {
    if (scholar.locations) {
      scholar.locations.forEach(loc => allLocations.add(loc))
    }
    if (scholar.birth_location) allLocations.add(scholar.birth_location)
    if (scholar.death_location) allLocations.add(scholar.death_location)
  })

  console.log(`📍 Found ${allLocations.size} unique locations`)

  // Get existing locations
  const { data: existingLocations } = await supabase
    .from('locations')
    .select('name')

  const existingLocationNames = new Set(existingLocations?.map(l => l.name) || [])

  // Prepare new locations
  const newLocations = Array.from(allLocations)
    .filter(loc => !existingLocationNames.has(loc))
    .map(locationName => {
      // Try to find coordinates for the location
      const coords = locationCoordinates[locationName] || locationCoordinates[locationName.split(',')[0]]
      
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

  return newLocations
}

function extractCountryFromName(locationName) {
  if (locationName.includes('Somalia')) return 'Somalia'
  if (locationName.includes('Kenya')) return 'Kenya'
  if (locationName.includes('Ethiopia')) return 'Ethiopia'
  if (locationName.includes('Saudi Arabia')) return 'Saudi Arabia'
  if (locationName.includes('Sudan')) return 'Sudan'
  if (locationName.includes('UAE') || locationName.includes('United Arab Emirates')) return 'UAE'
  if (locationName.includes('Sweden')) return 'Sweden'
  if (locationName.includes('Uganda')) return 'Uganda'
  return null
}

// Function to create scholar-location relationships
async function createScholarLocationRelationships(scholars) {
  console.log('🔗 Creating scholar-location relationships...')

  // Get location IDs
  const { data: locations } = await supabase
    .from('locations')
    .select('id, name')

  const locationMap = new Map(locations?.map(l => [l.name, l.id]) || [])

  const relationships = []

  scholars.forEach(scholar => {
    // Add birth location
    if (scholar.birth_location) {
      const locationId = locationMap.get(scholar.birth_location) || locationMap.get(scholar.birth_location.split(',')[0])
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

    // Add death location
    if (scholar.death_location) {
      const locationId = locationMap.get(scholar.death_location) || locationMap.get(scholar.death_location.split(',')[0])
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

    // Add study/residence locations from biography
    if (scholar.locations) {
      scholar.locations.forEach(locName => {
        const locationId = locationMap.get(locName)
        if (locationId && locName !== scholar.birth_location && locName !== scholar.death_location) {
          relationships.push({
            scholar_id: scholar.id,
            location_id: locationId,
            location_type: 'study',
            start_year: null,
            end_year: null
          })
        }
      })
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

// Function to detect and create scholar relationships
async function createScholarRelationships(scholars) {
  console.log('🤝 Detecting scholar relationships...')

  const relationships = []

  // Get all scholars (existing + new) for relationship detection
  const { data: allScholars } = await supabase
    .from('scholars')
    .select('id, name_english, birth_year, death_year, birth_location')

  const scholarMap = new Map(allScholars?.map(s => [s.name_english, s]) || [])

  scholars.forEach(scholar => {
    // Find contemporary scholars (overlapping lifespans)
    allScholars?.forEach(other => {
      if (other.name_english === scholar.name_english) return

      // Contemporary relationship (overlapping lifespans)
      if (scholar.birth_year && scholar.death_year && other.birth_year && other.death_year) {
        const overlap = Math.min(scholar.death_year, other.death_year) - Math.max(scholar.birth_year, other.birth_year)
        if (overlap > 10) { // At least 10 years of overlap
          relationships.push({
            scholar_id: scholar.id,
            related_scholar_id: other.id,
            relationship_type: 'contemporary'
          })
        }
      }

      // Location-based relationship (same birth location)
      if (scholar.birth_location && other.birth_location) {
        const sameLocation = scholar.birth_location.toLowerCase().includes(other.birth_location.toLowerCase()) ||
                            other.birth_location.toLowerCase().includes(scholar.birth_location.toLowerCase())
        if (sameLocation) {
          relationships.push({
            scholar_id: scholar.id,
            related_scholar_id: other.id,
            relationship_type: 'location_based'
          })
        }
      }
    })

    // Teacher-student relationships (based on students array)
    if (scholar.students) {
      scholar.students.forEach(studentName => {
        const student = scholarMap.get(studentName)
        if (student) {
          relationships.push({
            scholar_id: scholar.id,
            related_scholar_id: student.id,
            relationship_type: 'teacher'
          })
        }
      })
    }
  })

  // Remove duplicates
  const uniqueRelationships = relationships.filter((rel, index, self) =>
    index === self.findIndex(r => 
      (r.scholar_id === rel.scholar_id && r.related_scholar_id === rel.related_scholar_id && r.relationship_type === rel.relationship_type) ||
      (r.scholar_id === rel.related_scholar_id && r.related_scholar_id === rel.scholar_id && r.relationship_type === rel.relationship_type)
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

// Function to create works entries
async function createWorks(scholars) {
  console.log('📚 Creating works entries...')

  const works = []
  const workAuthors = []

  scholars.forEach(scholar => {
    if (scholar.major_works && scholar.major_works.length > 0) {
      scholar.major_works.forEach(workTitle => {
        // Extract year and other details from title
        const yearMatch = workTitle.match(/(\d{4})/)
        const pageMatch = workTitle.match(/(\d+)[\s-]*pages?/i)
        
        // Clean title
        const cleanTitle = workTitle.replace(/\s*-\s*\d+[\s-]*pages?.*$/i, '')
                                   .replace(/\s*,?\s*printed.*$/i, '')
                                   .replace(/\s*\(\d{4}\).*$/i, '')
                                   .trim()

        const work = {
          title_english: cleanTitle,
          title_arabic: generateArabicTitle(cleanTitle),
          title_transliteration: null,
          composition_year: yearMatch ? parseInt(yearMatch[1]) : null,
          composition_location: scholar.birth_location,
          subject_area: scholar.specializations.slice(0, 3),
          manuscript_status: workTitle.toLowerCase().includes('printed') ? 'published' : 'manuscript',
          description: `A scholarly work by ${scholar.name_english}`,
          notes: null,
          pages: pageMatch ? parseInt(pageMatch[1]) : null,
          language: 'Arabic',
          genre: determineGenre(cleanTitle, scholar.specializations),
          extant_copies: workTitle.toLowerCase().includes('printed') ? 1 : 0,
          library_locations: null,
          publication_details: extractPublicationDetails(workTitle)
        }

        works.push(work)

        // Create work-author relationship
        workAuthors.push({
          work_title: cleanTitle, // We'll need to match this after insertion
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

      // Now create work-author relationships
      if (insertedWorks && workAuthors.length > 0) {
        const workMap = new Map(insertedWorks.map(w => [w.title_english, w.id]))
        
        const validWorkAuthors = workAuthors
          .map(wa => ({
            work_id: workMap.get(wa.work_title),
            scholar_id: wa.scholar_id,
            author_role: wa.author_role,
            attribution_certainty: wa.attribution_certainty
          }))
          .filter(wa => wa.work_id) // Only include if we found the work ID

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
  // Simple mapping for common words
  const wordMap = {
    'The': 'ال',
    'of': 'في',
    'and': 'و',
    'in': 'في',
    'Islamic': 'الإسلامي',
    'Somali': 'الصومالي',
    'Language': 'اللغة',
    'Rules': 'القواعد',
    'History': 'التاريخ',
    'Life': 'الحياة',
    'Struggle': 'النضال'
  }

  const words = englishTitle.split(' ')
  const arabicWords = words.map(word => wordMap[word] || word)
  return arabicWords.join(' ')
}

function determineGenre(title, specializations) {
  if (title.toLowerCase().includes('rules') || title.toLowerCase().includes('grammar')) return 'Grammar treatise'
  if (title.toLowerCase().includes('history')) return 'Historical work'
  if (title.toLowerCase().includes('relations')) return 'Political treatise'
  if (title.toLowerCase().includes('biography') || title.toLowerCase().includes('life')) return 'Biography'
  if (specializations.includes('Jurisprudence') || specializations.includes('Fiqh')) return 'Jurisprudential work'
  if (specializations.includes('Sufism')) return 'Sufi treatise'
  return 'Scholarly treatise'
}

function extractPublicationDetails(workTitle) {
  const printMatch = workTitle.match(/printed.*?(\d{4})/i)
  if (printMatch) return `Printed in ${printMatch[1]}`
  return null
}

// Main upload function
async function uploadScholarData() {
  console.log('🚀 Starting comprehensive scholar data upload...')

  try {
    // Parse the scholar data
    const newScholars = parseScholars(rawScholarData)
    console.log(`📚 Parsed ${newScholars.length} scholars from raw data`)

    // Check for duplicates
    const uniqueScholars = await checkForDuplicates(newScholars)
    
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

    // Create scholar-location relationships
    await createScholarLocationRelationships(uniqueScholars)

    // Create scholar relationships
    await createScholarRelationships(uniqueScholars)

    // Create works
    await createWorks(uniqueScholars)

    console.log('🎉 Scholar data upload completed successfully!')

    // Test search functionality
    console.log('\n🧪 Testing search functionality...')
    const { data: searchTest, error: searchError } = await supabase
      .rpc('search_scholars', { search_query: 'Ibrahim', limit_count: 5 })

    if (searchError) {
      console.error('❌ Search test failed:', searchError)
    } else {
      console.log(`✅ Search test successful - found ${searchTest.length} results for "Ibrahim"`)
      searchTest.forEach(result => {
        console.log(`   • ${result.name_english} (${result.birth_year || 'unknown'})`)
      })
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

// Export functions
module.exports = {
  uploadScholarData,
  checkForDuplicates,
  processLocations,
  createScholarRelationships
}

// Run if called directly
if (require.main === module) {
  uploadScholarData()
}