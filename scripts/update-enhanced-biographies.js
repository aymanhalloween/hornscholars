const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Enhanced biographical data for the "duplicate" scholars with much more context
const enhancedScholarUpdates = [
  {
    name_english: 'Ibrahim Hashi Mahmoud',
    name_arabic: 'إبراهيم هاشي محمود',
    name_somali: null,
    birth_year: 1929,
    death_year: null,
    birth_location: 'Hudur, Somalia',
    death_location: null,
    biography: 'Sheikh Ibrahim Hashi Mahmoud was born in 1929 in the city of Hudur, Somalia, located in the Bakool region of Upper Juba. Born into a humble pastoral family of six who worked herding livestock in the Ogaden region, his family migrated to Upper Juba during historical invasions. Raised on sheep and cow milk, he began tending goats as a child and later herded sheep with his sisters. At age six, he was enrolled in a duksi (Quranic school) to memorize the Quran under teacher Osman Al-Awhasni, reaching Surah Ash-Shu\'ara. His family moved to the "Faf" agricultural area near Qabr Dhahare, where he joined the Salihiyya group under Sheikh Abdullah Sayyid Salih and memorized the entire Quran. Around 1938, he studied religious sciences including jurisprudence, exegesis, hadith, grammar, and morphology under Haj Mohammed Taas. In 1943, he studied advanced grammar and morphology in western northern Somalia, mastering Ibn Malik\'s Alfiyyah in two months and teaching it to students in six months. He studied Shafi\'i jurisprudence, particularly "Minhaj al-Talibin" by al-Nawawi, under Sheikh Jamal Hashi in Qalafo. In late 1949, he arrived in Mogadishu, teaching Arabic sciences at the Merwas Mosque before returning to western Somalia in 1958.',
    specializations: ['Shafi Jurisprudence', 'Arabic Grammar', 'Somali Language Development', 'Quranic Studies', 'Islamic Legal Systems', 'Arabic Literature', 'Hadith Studies', 'Morphology'],
    major_works: [
      'The Struggle of Life (Kifah al-Hayat) - 75-page autobiography printed in Mogadishu, October 1960',
      'The Somali Language in the Language of the Quran - advocating Arabic script for Somali, printed 1962',
      'Somali Language Rules - manuscript translated by Dr. Mohamed Hashi Mahmoud, printed Stockholm 1998',
      'Legal Systems of Sharia Accompaniments - printed in Mogadishu 1959',
      'Somalia and the Arabic Language - article in Al-Ahram newspaper, Cairo, March 25, 1957',
      'Somalia Requests Egypt to Provide Teachers and Books - Cairo Evening Newspaper, June 25, 1957',
      'This is Our Country, Somalia - Al-Jaras newspaper, Ain Shams University, 1957'
    ],
    teaching_positions: [
      'Arabic sciences teacher at Merwas Mosque, Mogadishu (1949-1950)',
      'Ibn Malik\'s Alfiyyah instructor in western Somalia (1943)',
      'Duksi teacher and Arabic language advocate'
    ],
    scholarly_achievements: [
      'Hafiz of the Quran (memorized entire Quran)',
      'Mastered Ibn Malik\'s Alfiyyah in two months',
      'Pioneer advocate for Arabic script in Somali language',
      'Published author and cultural writer',
      'Contributed to Somali-Arab cultural relations'
    ],
    students: ['Dr. Mohamed Hashi Mahmoud (Xindhakayame) - his brother who translated his works'],
    notable_contributions: 'Pioneer in advocating for the use of Arabic script in writing the Somali language, contributing significantly to the cultural and linguistic debates before Somalia\'s independence. His works on Somali language development and legal systems established him as a key figure in Somalia\'s intellectual and cultural identity formation.',
    intellectual_lineage: 'Educated in the traditional Salihiyya Sufi tradition under Sheikh Abdullah Sayyid Salih, studied instrumental Islamic sciences under Haj Mohammed Taas, and advanced Arabic grammar in the classical Azhar methodology tradition.',
    manuscripts_authored: 7,
    teaching_years_start: 1943,
    teaching_years_end: 1958
  },
  {
    name_english: 'Ibrahim Sheikh Ishaq',
    name_arabic: 'إبراهيم شيخ إسحاق',
    name_somali: null,
    birth_year: null,
    death_year: null,
    birth_location: 'Wajir, Kenya',
    death_location: null,
    biography: 'One of the prominent figures of Islamic advocacy in the Horn of Africa region, especially the northeastern part. A Kenyan of Somali origin born in rural Wajir, descended from the famous Degodia tribe. His early education began in his birthplace with Duksi schools for memorizing the Holy Quran under his father\'s supervision. He later moved to Wajir city and became a Duksi teacher for Quranic memorization. He embarked on an academic journey to Nairobi, joining an Islamic school led by Sheikh Sohaib Hassan Abdul Ghaffar. Subsequently, he traveled to Saudi Arabia, enrolling in secondary school in the Hejaz region in 1976, then joined the Islamic University of Madinah, specializing in the principles of Islamic jurisprudence (Usul al-Fiqh) in the Faculty of Sharia and Islamic Studies. After completing his bachelor\'s degree, he specialized further in Usul al-Fiqh at the same university. He played a significant role in spreading Islam and its culture among the Kenyan people through the Islamic University established after its split from the Islamic Reform Movement in Greater Somalia in 1982. Under his leadership for four years after its establishment, he also played a major role in relief and education fields, becoming the director of the Muslim Africa Committee office in East Africa. He was one of the founders of the Islamic community in Kenya and served as its first president.',
    specializations: ['Usul al-Fiqh (Principles of Islamic Jurisprudence)', 'Islamic Da\'wa', 'Educational Leadership', 'Islamic Community Development', 'Relief and Humanitarian Work', 'Islamic University Administration', 'Kenyan Islamic Studies'],
    major_works: [
      'Summary of Al-Zarkashi\'s Rules by Sheikh Abdul Wahab Ahmed bin Ali Al-Shaarani (973 AH) - Master\'s thesis at Islamic University of Madinah'
    ],
    teaching_positions: [
      'Duksi teacher for Quranic memorization in Wajir',
      'Islamic University leadership in Kenya (1982-1986)',
      'Director of Muslim Africa Committee office in East Africa',
      'First President of Islamic community in Kenya'
    ],
    scholarly_achievements: [
      'Bachelor\'s degree from Islamic University of Madinah',
      'Master\'s degree in Sharia and Islamic Studies',
      'Founder of Islamic community in Kenya',
      'Pioneer in Islamic education in East Africa',
      'Leader of Islamic Reform Movement in Kenya'
    ],
    students: ['Members of the Islamic community in Kenya', 'Students of the Islamic University in Kenya'],
    notable_contributions: 'Pioneered Islamic advocacy and community development in Kenya, established institutional frameworks for Islamic education, and played a crucial role in the Islamic Reform Movement. His work bridged traditional Somali Islamic scholarship with modern institutional Islamic education in East Africa.',
    intellectual_lineage: 'Traditional Degodia tribal Islamic education, enhanced by modern Islamic University of Madinah Salafi methodology, combining Horn of Africa Islamic traditions with Saudi academic rigor.',
    manuscripts_authored: 1,
    teaching_years_start: 1976,
    teaching_years_end: null
  },
  {
    name_english: 'Ibrahim Sheikh Abdi',
    name_arabic: 'إبراهيم شيخ عبدي',
    name_somali: null,
    birth_year: 1966,
    death_year: null,
    birth_location: 'Tughabur, Western Somalia',
    death_location: null,
    biography: 'Reverend Dr. Sheikh Ibrahim Sheikh Abdi Ali Sheikhali Al-Qutbi, son of Sheikh Abdi Ali and Maraya Ali Harsi, was born in the Tughabur region of Western Somalia in 1966. He grew up in the care of his parents and learned the Holy Quran from his father Sheikh Abdi Ali. He studied Shafi\'i jurisprudence including the books "Safinat al-Salah," "Al-Minhaj," "Umdat al-Salik," and "Al-Tawshih" by Al-Bajuri. He then moved to Mogadishu, where he initially worked in construction and agriculture before focusing on scholarly pursuits. In Mogadishu, he joined scientific circles, particularly lessons held at the Abu Bakr Mosque near American cable and the Jirde Hussein Mosque under Sheikh Sharif Abdul Noor, where he studied hadith books. His teachers included Sheikh Mohammed Sheikh Adam, Sheikh Yusuf Sheikh Abdullah (known as Sheikh Yusuf Noor), Sheikh Yusuf Mohammed Khalif, and Sheikh Haji Ismail Sheikh Adam, from whom he studied "Aqidah al-Wasitiyyah" and other texts. He studied under Sheikh Mahmoud Abdul Rahman Ahmed Qasim, who taught him "Al-Minhaj" by Al-Nawawi, Sheikh Mohammed Sheikh Adam who taught him "Tajrid Al-Bukhari," and Sheikh Mohammed Abdul Salam who taught him "Riyadh Al-Salihin" and "Al-Kawakib Al-Durriya" in grammar.',
    specializations: ['Shafi\'i Jurisprudence', 'Hadith Studies', 'Islamic Creed (Aqidah)', 'Arabic Grammar', 'Quranic Studies', 'Islamic Education', 'Comparative Fiqh', 'Traditional Islamic Sciences'],
    major_works: [], // No specific works mentioned in the biographical text
    teaching_positions: [
      'Traditional Islamic education in Tughabur region',
      'Participant in scholarly circles in Mogadishu mosques'
    ],
    scholarly_achievements: [
      'Mastery of classical Shafi\'i jurisprudential texts',
      'Studied under multiple prominent Mogadishu scholars',
      'Expert in hadith literature and Islamic creed',
      'Proficient in Arabic grammar and Islamic sciences'
    ],
    students: [], // Not specifically mentioned in the biography
    notable_contributions: 'Represents the continuity of traditional Islamic education from rural Somalia to urban scholarly centers. His educational journey from Tughabur to Mogadishu demonstrates the networks of Islamic learning that connected different regions of Somalia, preserving and transmitting classical Islamic knowledge.',
    intellectual_lineage: 'Traditional Somali Islamic education through his father Sheikh Abdi Ali, enhanced by the scholarly circles of Mogadishu including the traditions of Sheikh Sharif Abdul Noor, Sheikh Mohammed Sheikh Adam, and other prominent Mogadishu scholars.',
    manuscripts_authored: 0,
    teaching_years_start: null,
    teaching_years_end: null
  }
]

// Function to update existing scholars with enhanced data
async function updateScholarBiographies() {
  console.log('🔄 Updating existing scholars with enhanced biographical data...')
  console.log('=' .repeat(70))

  try {
    let updatedCount = 0

    for (const scholarUpdate of enhancedScholarUpdates) {
      console.log(`\n📝 Updating ${scholarUpdate.name_english}...`)

      // Find the existing scholar
      const { data: existingScholar, error: findError } = await supabase
        .from('scholars')
        .select('id, name_english, biography')
        .eq('name_english', scholarUpdate.name_english)
        .single()

      if (findError) {
        console.log(`⚠️  Scholar not found: ${scholarUpdate.name_english}`)
        continue
      }

      console.log(`   Current biography length: ${existingScholar.biography?.length || 0} characters`)
      console.log(`   New biography length: ${scholarUpdate.biography.length} characters`)

      // Update the scholar with enhanced data
      const { error: updateError } = await supabase
        .from('scholars')
        .update({
          name_arabic: scholarUpdate.name_arabic,
          birth_year: scholarUpdate.birth_year,
          death_year: scholarUpdate.death_year,
          birth_location: scholarUpdate.birth_location,
          death_location: scholarUpdate.death_location,
          biography: scholarUpdate.biography,
          specializations: scholarUpdate.specializations,
          major_works: scholarUpdate.major_works,
          teaching_positions: scholarUpdate.teaching_positions,
          scholarly_achievements: scholarUpdate.scholarly_achievements,
          students: scholarUpdate.students,
          notable_contributions: scholarUpdate.notable_contributions,
          intellectual_lineage: scholarUpdate.intellectual_lineage,
          manuscripts_authored: scholarUpdate.manuscripts_authored,
          teaching_years_start: scholarUpdate.teaching_years_start,
          teaching_years_end: scholarUpdate.teaching_years_end
        })
        .eq('id', existingScholar.id)

      if (updateError) {
        console.error(`❌ Failed to update ${scholarUpdate.name_english}:`, updateError)
      } else {
        console.log(`✅ Successfully updated ${scholarUpdate.name_english}`)
        console.log(`   Added ${scholarUpdate.specializations.length} specializations`)
        console.log(`   Added ${scholarUpdate.major_works.length} works`)
        console.log(`   Added ${scholarUpdate.teaching_positions.length} teaching positions`)
        updatedCount++
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} scholars with enhanced data!`)

    // Now update/add their works to the works database
    console.log('\n📚 Processing enhanced works data...')
    await updateWorksForScholars()

    // Test the updated data
    console.log('\n🧪 Testing updated scholar data...')
    await testUpdatedData()

  } catch (error) {
    console.error('💥 Error updating scholar biographies:', error)
  }
}

// Function to add works for the updated scholars
async function updateWorksForScholars() {
  for (const scholarData of enhancedScholarUpdates) {
    if (scholarData.major_works.length === 0) continue

    // Get scholar ID
    const { data: scholar, error: scholarError } = await supabase
      .from('scholars')
      .select('id')
      .eq('name_english', scholarData.name_english)
      .single()

    if (scholarError || !scholar) {
      console.log(`⚠️  Could not find scholar for works: ${scholarData.name_english}`)
      continue
    }

    console.log(`📖 Adding works for ${scholarData.name_english}...`)

    for (const workTitle of scholarData.major_works) {
      // Check if work already exists
      const { data: existingWork } = await supabase
        .from('works')
        .select('id')
        .eq('title_english', workTitle.split(' - ')[0]) // Use title before description
        .single()

      if (existingWork) {
        console.log(`   ⚠️  Work already exists: ${workTitle.substring(0, 50)}...`)
        continue
      }

      // Extract details from the work title
      const cleanTitle = workTitle.split(' - ')[0]
      const description = workTitle.includes(' - ') ? workTitle.split(' - ')[1] : ''
      
      // Extract year if present
      const yearMatch = description.match(/(\d{4})/)
      const year = yearMatch ? parseInt(yearMatch[1]) : null

      // Extract page count
      const pageMatch = description.match(/(\d+)[\s-]*pages?/i)
      const pages = pageMatch ? parseInt(pageMatch[1]) : null

      const work = {
        title_english: cleanTitle,
        title_arabic: generateArabicTitle(cleanTitle),
        title_transliteration: null,
        composition_year: year,
        composition_location: scholarData.birth_location?.split(',')[0],
        subject_area: scholarData.specializations.slice(0, 3),
        manuscript_status: description.toLowerCase().includes('printed') ? 'published' : 'manuscript',
        description: `${description}. A scholarly work by ${scholarData.name_english}.`,
        notes: null,
        pages: pages,
        language: 'Arabic',
        genre: determineGenre(cleanTitle, scholarData.specializations),
        extant_copies: description.toLowerCase().includes('printed') ? 1 : 0,
        library_locations: null,
        publication_details: description.includes('printed') ? description : null
      }

      // Insert the work
      const { data: insertedWork, error: workError } = await supabase
        .from('works')
        .insert(work)
        .select('id')
        .single()

      if (workError) {
        console.error(`❌ Error inserting work "${cleanTitle}":`, workError)
        continue
      }

      // Create work-author relationship
      const { error: authorError } = await supabase
        .from('work_authors')
        .insert({
          work_id: insertedWork.id,
          scholar_id: scholar.id,
          author_role: 'author',
          attribution_certainty: 'certain'
        })

      if (authorError) {
        console.error(`❌ Error creating work-author relationship:`, authorError)
      } else {
        console.log(`   ✅ Added: "${cleanTitle.substring(0, 50)}..."`)
      }
    }
  }
}

function generateArabicTitle(englishTitle) {
  const titleMap = {
    'The Struggle of Life': 'كفاح الحياة',
    'The Somali Language in the Language of the Quran': 'اللغة الصومالية في لغة القرآن',
    'Somali Language Rules': 'قواعد اللغة الصومالية',
    'Legal Systems of Sharia Accompaniments': 'الأنظمة القانونية لمرافقات الشريعة',
    'Somalia and the Arabic Language': 'الصومال واللغة العربية',
    'Summary of Al-Zarkashi\'s Rules': 'ملخص قواعد الزركشي'
  }

  return titleMap[englishTitle] || englishTitle
}

function determineGenre(title, specializations) {
  if (title.toLowerCase().includes('struggle') || title.toLowerCase().includes('life')) return 'Autobiography'
  if (title.toLowerCase().includes('language') || title.toLowerCase().includes('rules')) return 'Linguistic treatise'
  if (title.toLowerCase().includes('legal') || title.toLowerCase().includes('sharia')) return 'Legal treatise'
  if (title.toLowerCase().includes('summary') || title.toLowerCase().includes('rules')) return 'Scholarly commentary'
  if (specializations.includes('Jurisprudence') || specializations.includes('Fiqh')) return 'Jurisprudential work'
  return 'Scholarly treatise'
}

async function testUpdatedData() {
  // Test one of the updated scholars
  const { data: testScholar, error } = await supabase
    .from('scholars')
    .select(`
      *,
      scholar_locations (
        location_type,
        locations (name)
      )
    `)
    .eq('name_english', 'Ibrahim Hashi Mahmoud')
    .single()

  if (error) {
    console.error('❌ Test failed:', error)
  } else {
    console.log('✅ Updated scholar test successful:')
    console.log(`   Name: ${testScholar.name_english}`)
    console.log(`   Biography length: ${testScholar.biography.length} characters`)
    console.log(`   Specializations: ${testScholar.specializations.length}`)
    console.log(`   Works: ${testScholar.major_works.length}`)
    console.log(`   Teaching positions: ${testScholar.teaching_positions.length}`)
    console.log(`   Achievements: ${testScholar.scholarly_achievements.length}`)
  }

  // Test search with updated data
  const { data: searchResults } = await supabase
    .rpc('search_scholars', { search_query: 'Salihiyya', limit_count: 5 })

  console.log(`✅ Search test: Found ${searchResults.length} results for "Salihiyya"`)
}

// Run the update
updateScholarBiographies()