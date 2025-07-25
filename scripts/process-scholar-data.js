const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Enhanced scholar data processing
const rawScholarData = `
Ibrahim Hashi Mahmoud
Sheikh Ibrahim Hashi Mahmoud was born in 1929 in the city of Hudur, Somalia, located in the Bakool region of Upper Juba. He was born into a humble family consisting of six people who worked in herding livestock in the Ogaden region of Somalia. His family moved from the rural area of this region to Upper Juba, among the Ogaden tribes that migrated due to historical invasions that swept the country. During this migration, the caravan of tribes passed through the city of Hudur on their way to the eastern bank, where Ibrahim Hashi was born.

Sheikh Ibrahim Hashi was raised on the milk of sheep and cows. When he became aware, he found himself tending young goats. When he grew a bit older, he herded sheep with his two older sisters. At the age of six, his father enrolled him in a duksi (Quranic school) to memorize the Quran. However, he discontinued his Quranic education for a while and then returned to the duksi to renew his knowledge and memorization. He relearned writing and reading and continued until he reached Surah Ash-Shu'ara under the guidance of teacher Osman Al-Awhasni. After this, he left the Quranic school, and his family moved to the "Faf" area, an agricultural region near the city of Qabr Dhahare, where the Salihiyya group, followers of the Rashidiya order, were present. The group's leader at that time was Sheikh Abdullah Sayyid Salih. Ibrahim joined the group's Quranic school and managed to memorize the entire Quran by heart. Around 1938, he connected with the late Haj Mohammed Taas and studied religious sciences such as jurisprudence, exegesis, hadith, grammar, morphology, and other Arabic sciences known as "instrumental knowledge" under his guidance. He read Al-Ajrumiyyah and Abu Shuja, then left to go to an area in western northern Somalia in 1943. He studied grammar and morphology under the guidance of scholars who excelled in understanding and teaching grammar and morphology in the old Azhar method. He studied Ibn Malik's Alfiyyah in two months and memorized it by heart, then taught it to students in six months before returning.

Returning to the homeland. Then he went to the city of Qalaf to study Shafi'i jurisprudence, especially the book "Minhaj al-Talibin" by Muhyi al-Din al-Nawawi after seeking his father's permission. He studied jurisprudence under Sheikh Jamal Hashi, where he read half of the book with him. In late 1949, he arrived in Mogadishu from Qalaf, continuing his pursuit of knowledge while also teaching Arabic sciences at the Merwas Mosque. After a short period, he returned to the western Somalia region, specifically the city of Qabridahare in 1958.

Works:
1. The Struggle of Life - 75-page autobiography printed in Mogadishu in October 1960
2. The Somali Language in the Language of the Quran - advocating for Arabic script for Somali, printed in Mogadishu in 1962
3. Somali Language Rules - manuscript translated by Dr. Mohamed Hashi Mahmoud, printed in Stockholm 1998
4. Legal Systems of Sharia Accompaniments - printed in Mogadishu in 1959
5. Various articles in newspapers including Al-Ahram and Cairo Evening

Ibrahim Sheikh Ishaq
One of the prominent figures of Islamic advocacy in the Horn of Africa region, especially the northeastern part, is a Kenyan of Somali origin born in rural Wajir and descended from the famous Degodia tribe. Although his early education began in his birthplace, starting with Duksi schools for memorizing the Holy Quran under his father's supervision, he later moved to Wajir city and took on the role of a Duksi teacher for memorizing the Holy Quran.

After a short period, he decided to embark on an academic journey within Kenya, especially in the capital, Nairobi, where he joined an Islamic school led by Sheikh Sohaib Hassan Abdul Ghaffar. Subsequently, he began his journey abroad, particularly to Saudi Arabia, especially the Hejaz region, where he enrolled in secondary school in 1976 and then joined the Islamic University of Madinah, specializing in the principles of Islamic jurisprudence in the Faculty of Sharia and Islamic Studies.

After completing his bachelor's degree, he specialized in the principles of Islamic jurisprudence at the same university and faculty. Sheikh Ibrahim Sheikh Ishaq played a significant role in spreading Islam and its culture among the Kenyan people with the Islamic University established after its split from the Islamic Reform Movement in Greater Somalia in 1982. Four years after its establishment under his leadership, he also played a major role in relief and education fields, becoming the director of the Muslim Africa Committee office in East Africa. He was one of the founders of the Islamic community in Kenya and took on its first presidency.

Works:
1. Summary of Al-Zarkashi's Rules by Sheikh Abdul Wahab Ahmed bin Ali Al-Shaarani (973 AH) - Master's thesis at Islamic University of Madinah

Ibrahim Said Mohamed Qolid
Haj Ibrahim Said Mohamed Qolid's father, Mr. Mohamed Qolid, was one of the prominent scholars in Somalia, especially in the Salihiyah order. He was from Middle Shabeelle, originally from the Shabeelle region in Western Somalia.

Works:
1. The Radiant Pearls in the Virtues of the Salihiyah, Rashidiyah, and Ahmadiyah Orders - 228-page chronicle of the Salihiyah order in Somalia

Ibrahim Abdul Qadir Mohamed
Professor Ibrahim Abdul Qadir Mohamed was born in Mecca in 1994 but grew up in Bosaso, Somalia. He attended Imam Shafi'i Elementary School and Imam Nawawi School, studied middle school at Al-Najah School in Bosaso, and attended Ibn Hajar Al-Asqalani High School. He enrolled in the College of Sharia and Islamic Studies at East Africa University, then moved to Uganda and joined postgraduate studies at the Islamic University in Uganda. He worked as a lecturer at the College of Sharia at East Africa University in Bosaso. Son of Dr. Abdul Qadir Mohamed Abdullah, president of East Africa University.

Works:
1. International Relations During the Era of Omar Ibn Al-Khattab (may God be pleased with him) - research thesis consisting of introduction, three chapters, and conclusion

Ibrahim Abdullah Mohammed
Sheikh Ibrahim Abdullah Mohammed Mah was born in the city of Qalaf in Western Somalia in 1941. He grew up and was raised in his hometown, where he studied Islamic sciences, memorized the Holy Quran, learned Arabic, and then studied Arabic language rules and literature along with Shafi'i jurisprudence. After he became proficient, he traveled abroad, especially to the Kingdom of Saudi Arabia, and joined Imam Muhammad bin Saud University in 1966, graduating in 1970. When he returned to Somalia, he became a teacher in Somali secondary schools starting in 1973. He then became a member of the Central Committee of the Western Somali Liberation Front in 1989, and in 1991, he was chosen as the president of the National Front for the Liberation of Ogadenia, continuing in this position until 1998. He then devoted himself to cultural aspects, founding the Regional Center for Research and Strategic Studies in the Horn of Africa in 1999. He passed away on June 22, 2008, in Abu Dhabi, United Arab Emirates.

Works:
1. The Masterpiece of the Loyalists: The Journey of Liberation and Arabization in the Horn of Africa - 736-page historical encyclopedia, printed in UAE 2001
2. Ogaden Challenges - 40-page collection of militant messages, printed in Sudan 1994
3. Interpretation of History - printed in 1992, also translated into Somali
4. The Map Wars in the Horn of Africa and Ethiopian Panic over Cultural Change - manuscript
5. Origins of Somali Words in Arabic - under completion

Ibrahim Sheikh Abdi
Reverend Dr. Sheikh Ibrahim Sheikh Abdi Ali Sheikhali Al-Qutbi was born in the Tughabur region of Western Somalia in 1966. He grew up in the care of his parents and learned the Holy Quran from his father Sheikh Abdi Ali. He also studied Shafi'i jurisprudence, including books like "Safinat al-Salah," "Al-Minhaj," "Umdat al-Salik," and "Al-Tawshih" by Al-Bajuri. He then moved to Mogadishu, where he worked in construction and agriculture before focusing on scientific circles, particularly lessons at Abu Bakr Mosque and Jirde Hussein Mosque under various scholars including Sheikh Sharif Abdul Noor, Sheikh Mohammed Sheikh Adam, Sheikh Yusuf Sheikh Abdullah (Sheikh Yusuf Noor), and others.
`

// Function to extract locations from text
function extractLocations(text) {
  const locations = new Set()
  
  // Common location patterns
  const locationPatterns = [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*Somalia\b/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*Ethiopia\b/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*Kenya\b/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*Western\s+Somalia\b/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*Northern\s+Somalia\b/g,
    /\bMecca\b/g,
    /\bMedina\b/g,
    /\bMogadishu\b/g,
    /\bBosaso\b/g,
    /\bWajir\b/g,
    /\bNairobi\b/g,
    /\bUganda\b/g,
    /\bSaudi\s+Arabia\b/g,
    /\bUnited\s+Arab\s+Emirates\b/g,
    /\bAbu\s+Dhabi\b/g,
    /\bSudan\b/g,
    /\bSweden\b/g,
    /\bStockholm\b/g
  ]

  locationPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        locations.add(match[1])
      } else {
        locations.add(match[0])
      }
    }
  })

  return Array.from(locations)
}

// Function to extract works from scholar text
function extractWorks(scholarText) {
  const works = []
  
  // Look for "Works:" section and parse it
  const worksMatch = scholarText.match(/Works?:\s*([\s\S]*?)(?=\n\n[A-Z]|$)/i)
  if (worksMatch) {
    const worksText = worksMatch[1]
    const workLines = worksText.split('\n').filter(line => line.trim().match(/^\d+\./))
    
    workLines.forEach(line => {
      const workMatch = line.match(/^\d+\.\s*(.+)/)
      if (workMatch) {
        const workTitle = workMatch[1].trim()
        
        // Extract year if present
        const yearMatch = workTitle.match(/(\d{4})/)
        const year = yearMatch ? parseInt(yearMatch[1]) : null
        
        // Extract page count if present
        const pageMatch = workTitle.match(/(\d+)[\s-]*pages?/i)
        const pages = pageMatch ? parseInt(pageMatch[1]) : null
        
        works.push({
          title: workTitle,
          year: year,
          pages: pages
        })
      }
    })
  }

  return works
}

// Function to extract specializations from biography
function extractSpecializations(text) {
  const specializations = new Set()
  
  const patterns = [
    /jurisprudence/gi,
    /fiqh/gi,
    /hadith/gi,
    /grammar/gi,
    /morphology/gi,
    /Arabic\s+sciences/gi,
    /Quranic?\s+studies/gi,
    /Islamic\s+studies/gi,
    /Shafi[\'']?i\s+jurisprudence/gi,
    /principles\s+of\s+Islamic\s+jurisprudence/gi,
    /usul\s+al-fiqh/gi,
    /exegesis/gi,
    /tafsir/gi,
    /Sufism/gi,
    /Salihiyya/gi,
    /Islamic\s+advocacy/gi,
    /da[\'']?wa/gi,
    /international\s+relations/gi,
    /Islamic\s+diplomacy/gi,
    /Sharia\s+studies/gi,
    /Islamic\s+history/gi,
    /educational\s+leadership/gi,
    /Arabic\s+language/gi,
    /linguistic\s+research/gi,
    /Islamic\s+education/gi,
    /curriculum\s+development/gi,
    /educational\s+research/gi,
    /religious\s+leadership/gi
  ]

  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => {
        // Normalize the specialization
        let normalized = match.toLowerCase()
          .replace(/islamic\s+/, 'Islamic ')
          .replace(/arabic\s+/, 'Arabic ')
          .replace(/quranic?\s+/, 'Quranic ')
          .replace(/shafi\'?i\s+/, 'Shafi ')
        
        // Capitalize first letter
        normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1)
        specializations.add(normalized)
      })
    }
  })

  return Array.from(specializations).slice(0, 8) // Limit to 8 specializations
}

// Function to extract teachers from biography
function extractTeachers(text) {
  const teachers = new Set()
  
  const patterns = [
    /under\s+(?:the\s+guidance\s+of\s+)?(?:teacher\s+|Sheikh\s+|Dr\.\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /studied\s+under\s+(?:Sheikh\s+|Dr\.\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /teacher\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /Sheikh\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
  ]

  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const teacher = match[1].trim()
      if (teacher && teacher.length < 50 && !teacher.includes('University') && !teacher.includes('School')) {
        teachers.add(teacher)
      }
    }
  })

  return Array.from(teachers).slice(0, 10) // Limit to 10 teachers
}

// Parse the raw data into structured scholar objects
function parseScholars(rawData) {
  const scholarSections = rawData.split(/(?=^[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$)/m)
    .filter(section => section.trim().length > 100)

  const scholars = []

  scholarSections.forEach((section, index) => {
    const lines = section.trim().split('\n')
    const nameMatch = lines[0].match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/)
    
    if (!nameMatch) return

    const name = nameMatch[1].trim()
    const fullText = section

    // Extract birth year
    const birthYearMatch = fullText.match(/born\s+in\s+(\d{4})/i)
    const birthYear = birthYearMatch ? parseInt(birthYearMatch[1]) : null

    // Extract death year
    const deathYearMatch = fullText.match(/(?:died|passed\s+away).*?(\d{4})/i)
    const deathYear = deathYearMatch ? parseInt(deathYearMatch[1]) : null

    // Extract birth location
    const birthLocationMatch = fullText.match(/born\s+in\s+(?:\d{4}\s+in\s+)?(?:the\s+(?:city\s+of\s+|region\s+of\s+)?)?([^.,]+)/i)
    const birthLocation = birthLocationMatch ? birthLocationMatch[1].trim() : null

    // Extract death location
    const deathLocationMatch = fullText.match(/(?:died|passed\s+away).*?in\s+([^.,\n]+)/i)
    const deathLocation = deathLocationMatch ? deathLocationMatch[1].trim() : null

    // Create Arabic name (simplified transliteration)
    const arabicName = generateArabicName(name)

    const scholar = {
      name_english: name,
      name_arabic: arabicName,
      name_somali: null, // Could be extracted if present
      birth_year: birthYear,
      death_year: deathYear,
      birth_location: birthLocation,
      death_location: deathLocation,
      biography: extractBiographySummary(fullText),
      specializations: extractSpecializations(fullText),
      major_works: extractWorks(fullText).map(w => w.title).slice(0, 10),
      teaching_positions: extractTeachingPositions(fullText),
      scholarly_achievements: extractAchievements(fullText),
      students: extractTeachers(fullText), // Teachers become students for reverse relationships
      notable_contributions: extractNotableContributions(fullText),
      intellectual_lineage: extractIntellectualLineage(fullText),
      manuscripts_authored: extractWorks(fullText).length,
      teaching_years_start: extractTeachingYears(fullText).start,
      teaching_years_end: extractTeachingYears(fullText).end,
      locations: extractLocations(fullText)
    }

    scholars.push(scholar)
  })

  return scholars
}

// Helper functions
function generateArabicName(englishName) {
  const nameMap = {
    'Ibrahim': 'إبراهيم',
    'Hashi': 'هاشي', 
    'Mahmoud': 'محمود',
    'Sheikh': 'شيخ',
    'Ishaq': 'إسحاق',
    'Said': 'سعيد',
    'Mohamed': 'محمد',
    'Mohammed': 'محمد',
    'Qolid': 'قوليد',
    'Abdul': 'عبد',
    'Qadir': 'القادر',
    'Abdullah': 'عبد الله',
    'Abdi': 'عبدي',
    'Ali': 'علي'
  }

  const parts = englishName.split(' ')
  const arabicParts = parts.map(part => nameMap[part] || part)
  return arabicParts.join(' ')
}

function extractBiographySummary(text) {
  // Get first paragraph as biography summary
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50)
  return paragraphs[1] || paragraphs[0] || '' // Skip title, take first content paragraph
}

function extractTeachingPositions(text) {
  const positions = new Set()
  
  const patterns = [
    /teacher\s+(?:at|in)\s+([^.,\n]+)/gi,
    /lecturer\s+(?:at|in)\s+([^.,\n]+)/gi,
    /professor\s+(?:at|in)\s+([^.,\n]+)/gi,
    /imam\s+(?:at|in)\s+([^.,\n]+)/gi,
    /director\s+of\s+([^.,\n]+)/gi,
    /president\s+of\s+([^.,\n]+)/gi
  ]

  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const position = match[0].trim()
      if (position.length < 100) {
        positions.add(position)
      }
    }
  })

  return Array.from(positions).slice(0, 5)
}

function extractAchievements(text) {
  const achievements = []
  
  // Look for degree achievements
  if (text.includes('master')) achievements.push('Master\'s degree')
  if (text.includes('bachelor')) achievements.push('Bachelor\'s degree')
  if (text.includes('PhD') || text.includes('doctorate')) achievements.push('Doctorate degree')
  if (text.includes('memorized the entire Quran')) achievements.push('Hafiz of the Quran')
  if (text.includes('founded') || text.includes('established')) achievements.push('Institution founder')
  if (text.includes('president') || text.includes('director')) achievements.push('Leadership position')

  return achievements.slice(0, 5)
}

function extractNotableContributions(text) {
  // Extract a key contribution from the biography
  if (text.includes('advocate') || text.includes('advocating')) {
    return 'Advocated for Islamic education and Somali language development'
  }
  if (text.includes('liberation') || text.includes('freedom')) {
    return 'Contributed to liberation movements and political leadership'
  }
  if (text.includes('research') || text.includes('studies')) {
    return 'Advanced Islamic scholarship through research and academic work'
  }
  if (text.includes('education') || text.includes('teaching')) {
    return 'Dedicated to Islamic education and knowledge transmission'
  }
  return 'Significant contributions to Islamic scholarship and community leadership'
}

function extractIntellectualLineage(text) {
  // Extract key educational influences
  const lineageElements = []
  
  if (text.includes('Salihiyya')) lineageElements.push('Salihiyya Sufi tradition')
  if (text.includes('Shafi')) lineageElements.push('Shafi school of jurisprudence')
  if (text.includes('Azhar')) lineageElements.push('Al-Azhar educational tradition')
  if (text.includes('Islamic University')) lineageElements.push('Modern Islamic university education')

  if (lineageElements.length > 0) {
    return `Educated in the ${lineageElements.join(', ')} tradition`
  }
  return 'Traditional Islamic scholarly lineage'
}

function extractTeachingYears(text) {
  const startMatch = text.match(/(?:teacher|teaching|lecturer).*?(?:starting\s+in\s+|from\s+|since\s+)(\d{4})/i)
  const endMatch = text.match(/(?:until|to|through)\s+(\d{4})/i)
  
  return {
    start: startMatch ? parseInt(startMatch[1]) : null,
    end: endMatch ? parseInt(endMatch[1]) : null
  }
}

// Main processing function
async function processScholarData() {
  console.log('🚀 Starting enhanced scholar data processing...')
  
  try {
    // Parse the raw data
    const scholars = parseScholars(rawScholarData)
    console.log(`📚 Parsed ${scholars.length} scholars from the data`)

    // Process each scholar
    scholars.forEach((scholar, index) => {
      console.log(`\n📖 Scholar ${index + 1}: ${scholar.name_english}`)
      console.log(`   Birth: ${scholar.birth_year || 'Unknown'}`)
      console.log(`   Location: ${scholar.birth_location || 'Unknown'}`) 
      console.log(`   Specializations: ${scholar.specializations.join(', ')}`)
      console.log(`   Works: ${scholar.major_works.length}`)
      console.log(`   Teaching positions: ${scholar.teaching_positions.length}`)
    })

    return scholars

  } catch (error) {
    console.error('💥 Error processing scholar data:', error)
    return []
  }
}

// Export for use
module.exports = {
  processScholarData,
  parseScholars,
  extractLocations,
  extractWorks,
  rawScholarData
}

// Run if called directly
if (require.main === module) {
  processScholarData()
}