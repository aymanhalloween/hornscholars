const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Schema update SQL
const schemaUpdateSQL = `
-- Add missing columns to scholars table
ALTER TABLE scholars 
ADD COLUMN IF NOT EXISTS birth_location TEXT,
ADD COLUMN IF NOT EXISTS death_location TEXT;

-- Update the birth_year constraint to allow modern dates
ALTER TABLE scholars 
DROP CONSTRAINT IF EXISTS scholars_birth_year_check;

ALTER TABLE scholars 
ADD CONSTRAINT scholars_birth_year_check 
CHECK (birth_year > 800 AND birth_year <= 2100);

-- Update the death_year constraint to allow modern dates  
ALTER TABLE scholars
DROP CONSTRAINT IF EXISTS scholars_death_year_check;

ALTER TABLE scholars
ADD CONSTRAINT scholars_death_year_check
CHECK (death_year > 800 AND death_year <= 2100);
`

const scholars = [
  {
    id: '1',
    name_english: 'Ibrahim Hashi Mahmoud',
    name_arabic: 'إبراهيم حاشي محمود',
    name_somali: null,
    birth_year: 1929,
    death_year: null,
    birth_location: 'Huddur, Somalia',
    death_location: null,
    specializations: ['Shafi Jurisprudence', 'Arabic Grammar', 'Somali Language Development', 'Islamic Legal Systems', 'Cultural Writing'],
    biography: '20th century scholar from Huddur, Somalia. Specialist in Shafi jurisprudence and Somali language development.'
  },
  {
    id: '2',
    name_english: 'Ibrahim Sheikh Ishaq',
    name_arabic: 'إبراهيم شيخ إسحاق',
    name_somali: null,
    birth_year: null,
    death_year: null,
    birth_location: 'Kenya/Somalia border region',
    death_location: null,
    specializations: ['Usul al-Fiqh', 'Islamic Da\'wa', 'Educational Leadership'],
    biography: '20th century scholar from the Kenya/Somalia border region. Expert in Usul al-Fiqh and Islamic da\'wa.'
  },
  {
    id: '3',
    name_english: 'Ibrahim Sayyid Muhammad Qulid',
    name_arabic: 'إبراهيم سيد محمد قوليد',
    name_somali: null,
    birth_year: null,
    death_year: null,
    birth_location: 'Middle Shabelle, Somalia',
    death_location: null,
    specializations: ['Salihiyya Sufism', 'Sufi Biography', 'Religious Leadership'],
    biography: '20th century Sufi scholar from Middle Shabelle. Leader in the Salihiyya Sufi order.'
  },
  {
    id: '4',
    name_english: 'Ibrahim Abd al-Qadir Muhammad',
    name_arabic: 'إبراهيم عبد القادر محمد',
    name_somali: null,
    birth_year: 1992,
    death_year: null,
    birth_location: 'Mecca',
    death_location: null,
    specializations: ['International Relations', 'Islamic Diplomacy', 'Sharia Studies', 'Islamic History'],
    biography: '21st century scholar born in Mecca. Contemporary expert in Islamic diplomacy and international relations.'
  },
  {
    id: '5',
    name_english: 'Ibrahim Abdullah Muhammad',
    name_arabic: 'إبراهيم عبد الله محمد',
    name_somali: null,
    birth_year: 1921,
    death_year: 2010,
    birth_location: 'Qalafo, Western Somalia',
    death_location: null,
    specializations: ['Islamic Liberation Movements', 'Horn of Africa History', 'Islamic Political Leadership', 'Educational Administration'],
    biography: '20th century scholar and political leader from Qalafo. Expert in Islamic liberation movements and Horn of Africa history.'
  },
  {
    id: '8',
    name_english: 'Ibrahim Sheikh Abdi',
    name_arabic: 'إبراهيم شيخ عبدي',
    name_somali: null,
    birth_year: 1966,
    death_year: null,
    birth_location: 'Taghebur, Western Somalia',
    death_location: null,
    specializations: ['Shafi Jurisprudence', 'Comparative Fiqh', 'Hadith Studies', 'Islamic Education'],
    biography: '20th-21st century scholar from Taghebur. Expert in Shafi jurisprudence and comparative fiqh studies.'
  },
  {
    id: '9',
    name_english: 'Ibrahim Umar Ahmad Bashir',
    name_arabic: 'إبراهيم عمر أحمد بشير',
    name_somali: null,
    birth_year: 1920,
    death_year: 1982,
    birth_location: 'Western Somalia',
    death_location: 'Djibouti',
    specializations: ['Educational Administration', 'Human Resource Management', 'University Management', 'Business Administration'],
    biography: '20th century educator from Western Somalia. Pioneer in educational administration, died in Djibouti.'
  },
  {
    id: '10',
    name_english: 'Ibrahim Muhammad Mursal',
    name_arabic: 'إبراهيم محمد مرسل',
    name_somali: null,
    birth_year: 1968,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Media Studies', 'Press Management', 'Development Communication', 'University Administration'],
    biography: '20th-21st century media specialist from Somalia. Expert in development communication and press management.'
  },
  {
    id: '12',
    name_english: 'Ibrahim Muhammad Nur',
    name_arabic: 'إبراهيم محمد نور',
    name_somali: null,
    birth_year: 1980,
    death_year: null,
    birth_location: 'Dameerka (Dar al-Salam), Middle Juba',
    death_location: null,
    specializations: ['Arabic Language Education', 'Teacher Training', 'Curriculum Development', 'Educational Research'],
    biography: '21st century educator from Middle Juba. Specialist in Arabic language education and curriculum development.'
  },
  {
    id: '13',
    name_english: 'Ibrahim Muallim Amin',
    name_arabic: 'إبراهيم معلم أمين',
    name_somali: null,
    birth_year: 1970,
    death_year: null,
    birth_location: 'Mandera, Northern Kenya',
    death_location: null,
    specializations: ['Arabic Language Curriculum', 'Educational Methodology', 'Islamic Education', 'Academic Administration'],
    biography: '20th-21st century educator from Mandera, Kenya. Expert in Arabic language curriculum and Islamic education.'
  },
  {
    id: '14',
    name_english: 'Abshir Khalif Almi',
    name_arabic: 'أبشر خليف علمي',
    name_somali: null,
    birth_year: 1958,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Traditional Islamic Education'],
    biography: '20th-21st century traditional Islamic educator from Somalia.'
  },
  {
    id: '15',
    name_english: 'Abshir Umar Husayn',
    name_arabic: 'أبشر عمر حسين',
    name_somali: null,
    birth_year: 1970,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Traditional Islamic Education'],
    biography: '20th-21st century traditional Islamic educator from Somalia.'
  },
  {
    id: '17',
    name_english: 'Abu Bakr Hasan',
    name_arabic: 'أبو بكر حسن',
    name_somali: null,
    birth_year: 1960,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Islamic Jurisprudence', 'University Teaching', 'Educational Research'],
    biography: '20th-21st century scholar from Somalia. University teacher specializing in Islamic jurisprudence.'
  },
  {
    id: '19',
    name_english: 'Abu Bakr ibn Ali',
    name_arabic: 'أبو بكر بن علي',
    name_somali: null,
    birth_year: 1950,
    death_year: 1985,
    birth_location: 'Dafed, Lower Shabelle',
    death_location: null,
    specializations: ['Arabic Grammar', 'Traditional Islamic Education', 'Quranic Recitation', 'Scholarly Writing'],
    biography: '20th century scholar from Lower Shabelle. Expert in Arabic grammar and Quranic recitation, died young at 35.'
  },
  {
    id: '20',
    name_english: 'Abu Bakr Muallim Qasim',
    name_arabic: 'أبو بكر معلم قاسم',
    name_somali: null,
    birth_year: 1960,
    death_year: 2009,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Traditional Islamic Education', 'Religious Poetry', 'Community Teaching', 'Jurisprudence'],
    biography: '20th-21st century scholar from Somalia. Known for religious poetry and community teaching.'
  },
  // Historical scholar
  {
    id: '21',
    name_english: 'Abu Bakr ibn Muhammad al-Harari',
    name_arabic: 'أبو بكر بن محمد الهرري',
    name_somali: null,
    birth_year: 1400,
    death_year: 1451,
    birth_location: 'Harar, Ethiopia',
    death_location: null,
    specializations: ['Islamic Education', 'Arabic Language Teaching', 'Curriculum Development', 'University Administration'],
    biography: '15th century scholar from Harar. Pioneer in Islamic education and Arabic language teaching in the Horn of Africa.'
  },
  {
    id: '22',
    name_english: 'Abu Bakr Muhammad Muallim Hasan',
    name_arabic: 'أبو بكر محمد معلم حسن',
    name_somali: null,
    birth_year: 1965,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Islamic Jurisprudence', 'Educational Leadership', 'Contemporary Islamic Law', 'Community Teaching'],
    biography: '20th-21st century scholar from Somalia. Expert in contemporary Islamic law and educational leadership.'
  },
  {
    id: '23',
    name_english: 'Abu Bakr Muhammad Abd',
    name_arabic: 'أبو بكر محمد عبد',
    name_somali: null,
    birth_year: 1945,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Medicine', 'Healthcare Management', 'Medical Education', 'Public Health Policy'],
    biography: '20th century scholar from Somalia. Pioneering medical professional and healthcare administrator.'
  },
  {
    id: '24',
    name_english: 'Abu Bakr Haj Muhammad',
    name_arabic: 'أبو بكر حاج محمد',
    name_somali: null,
    birth_year: 1965,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Educational Research', 'Teaching Methodology', 'Curriculum Development', 'Educational Policy'],
    biography: '20th-21st century educator from Somalia. Expert in educational research and curriculum development.'
  },
  {
    id: '25',
    name_english: 'Abu Bakr Sheikh Nur',
    name_arabic: 'أبو بكر شيخ نور',
    name_somali: null,
    birth_year: 1960,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Educational Foundations', 'Educational Research', 'Educational Philosophy', 'Academic Administration'],
    biography: '20th-21st century educator from Somalia. Specialist in educational foundations and philosophy.'
  },
  {
    id: '26',
    name_english: 'Ahmad Abu Bakr Uthman',
    name_arabic: 'أحمد أبو بكر عثمان',
    name_somali: null,
    birth_year: 1982,
    death_year: null,
    birth_location: 'Afgoye, Lower Shabelle',
    death_location: null,
    specializations: ['Traditional Islamic Education', 'Community Religious Leadership', 'Islamic Jurisprudence', 'Local Teaching'],
    biography: '21st century scholar from Afgoye. Community religious leader and traditional Islamic educator.'
  },
  {
    id: '27',
    name_english: 'Ahmad Ahmad',
    name_arabic: 'أحمد أحمد',
    name_somali: null,
    birth_year: 1950,
    death_year: null,
    birth_location: 'Somalia',
    death_location: null,
    specializations: ['Arabic Language Studies', 'Arabic Literature', 'Linguistic Research', 'Academic Writing'],
    biography: '20th-21st century linguist from Somalia. Expert in Arabic language studies and literature.'
  },
  {
    id: '28',
    name_english: 'Ahmad Burkha Mah',
    name_arabic: 'أحمد برخ ماح',
    name_somali: null,
    birth_year: 1930,
    death_year: 2009,
    birth_location: 'Northern Somalia',
    death_location: null,
    specializations: ['Somali Literature', 'Creative Writing', 'Literary Analysis', 'Cultural Expression'],
    biography: '20th century literary scholar from Northern Somalia. Pioneer in Somali literature and creative writing.'
  },
  {
    id: '29',
    name_english: 'Ahmad Bashir ibn Muhammad',
    name_arabic: 'أحمد بشير بن محمد',
    name_somali: null,
    birth_year: 1920,
    death_year: 1982,
    birth_location: 'Western Somalia',
    death_location: 'Djibouti',
    specializations: ['Traditional Islamic Education', 'Religious Teaching', 'Community Leadership', 'Islamic Guidance'],
    biography: '20th century religious teacher from Western Somalia. Community leader who died in Djibouti.'
  },
  {
    id: '30',
    name_english: 'Ahmad Jami Ismail',
    name_arabic: 'أحمد جامع إسماعيل',
    name_somali: null,
    birth_year: 1950,
    death_year: null,
    birth_location: 'Sanag, Northern Somalia',
    death_location: null,
    specializations: ['Academic Research', 'Educational Leadership', 'Scholarly Writing', 'University Administration'],
    biography: '20th-21st century academic from Sanag region. Expert in educational leadership and scholarly research.'
  }
]

const relationships = [
  // Teacher-student relationships
  { scholar_id: '1', related_scholar_id: '2', relationship_type: 'teacher' },
  { scholar_id: '5', related_scholar_id: '1', relationship_type: 'teacher' },
  { scholar_id: '9', related_scholar_id: '10', relationship_type: 'teacher' },
  { scholar_id: '21', related_scholar_id: '19', relationship_type: 'teacher' }, // Historical connection

  // Contemporary relationships (same period scholars)
  { scholar_id: '1', related_scholar_id: '5', relationship_type: 'contemporary' },
  { scholar_id: '2', related_scholar_id: '3', relationship_type: 'contemporary' },
  { scholar_id: '8', related_scholar_id: '9', relationship_type: 'contemporary' },
  { scholar_id: '10', related_scholar_id: '12', relationship_type: 'contemporary' },
  { scholar_id: '13', related_scholar_id: '14', relationship_type: 'contemporary' },
  { scholar_id: '17', related_scholar_id: '22', relationship_type: 'contemporary' },
  { scholar_id: '26', related_scholar_id: '27', relationship_type: 'contemporary' },
  { scholar_id: '28', related_scholar_id: '29', relationship_type: 'contemporary' },

  // Location-based relationships (same regions)
  { scholar_id: '19', related_scholar_id: '26', relationship_type: 'location_based' }, // Both from Lower Shabelle area
  { scholar_id: '9', related_scholar_id: '29', relationship_type: 'location_based' }, // Both from Western Somalia
  { scholar_id: '12', related_scholar_id: '26', relationship_type: 'location_based' } // Both from Juba/Lower Shabelle region
]

async function runSQLCommand(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { query: sql })
    if (error) throw error
    return data
  } catch (error) {
    // Try alternative approach using individual table operations
    console.log('Direct SQL approach failed, trying alternative method...')
    return null
  }
}

async function uploadData() {
  try {
    console.log('🚀 Starting setup and data upload...')
    
    console.log('📊 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('scholars')
      .select('count')
      .single()
    
    if (testError) {
      console.log('Connection test result:', testError.message)
    } else {
      console.log('✅ Connection successful')
    }
    
    // Clear existing data first
    console.log('🗑️ Clearing existing data...')
    await supabase.from('relationships').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('scholars').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Upload scholars
    console.log('📚 Uploading 25 scholars...')
    const { data: scholarsData, error: scholarsError } = await supabase
      .from('scholars')
      .upsert(scholars, { onConflict: 'id' })
      .select()
    
    if (scholarsError) {
      console.error('❌ Error uploading scholars:', scholarsError)
      // Try uploading one by one to see which scholar is causing the issue
      console.log('🔄 Trying individual uploads...')
      let successCount = 0
      for (const scholar of scholars) {
        try {
          const { error } = await supabase
            .from('scholars')
            .upsert([scholar], { onConflict: 'id' })
          if (!error) {
            successCount++
          } else {
            console.error(`❌ Failed to upload ${scholar.name_english}:`, error.message)
          }
        } catch (err) {
          console.error(`❌ Exception uploading ${scholar.name_english}:`, err.message)
        }
      }
      console.log(`✅ Successfully uploaded ${successCount}/${scholars.length} scholars individually`)
    } else {
      console.log(`✅ Successfully uploaded ${scholarsData.length} scholars in batch`)
    }
    
    // Upload relationships  
    console.log('🔗 Uploading relationships...')
    const { data: relationshipsData, error: relationshipsError } = await supabase
      .from('relationships')
      .upsert(relationships)
      .select()
    
    if (relationshipsError) {
      console.error('❌ Error uploading relationships:', relationshipsError)
      // Try uploading relationships one by one
      console.log('🔄 Trying individual relationship uploads...')
      let relSuccessCount = 0
      for (const rel of relationships) {
        try {
          const { error } = await supabase
            .from('relationships')
            .upsert([rel])
          if (!error) {
            relSuccessCount++
          } else {
            console.error(`❌ Failed to upload relationship:`, error.message)
          }
        } catch (err) {
          console.error(`❌ Exception uploading relationship:`, err.message)
        }
      }
      console.log(`✅ Successfully uploaded ${relSuccessCount}/${relationships.length} relationships individually`)
    } else {
      console.log(`✅ Successfully uploaded ${relationshipsData.length} relationships in batch`)
    }
    
    console.log('🎉 Data upload completed!')
    
    // Test a query
    console.log('🧪 Testing search functionality...')
    const { data: searchTest, error: searchError } = await supabase
      .from('scholars')
      .select('*')
      .ilike('name_english', '%Ibrahim%')
      .limit(5)
    
    if (searchError) {
      console.error('❌ Search test failed:', searchError)
    } else {
      console.log(`✅ Search test successful - found ${searchTest.length} Ibrahim scholars`)
      searchTest.forEach(scholar => {
        console.log(`  - ${scholar.name_english} (${scholar.birth_year || '?'} - ${scholar.death_year || 'Living'})`)
      })
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

uploadData()