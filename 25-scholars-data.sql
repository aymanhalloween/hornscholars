-- Insert 25 scholars from user data
-- Clear existing user data first (keep original 5 sample scholars)
DELETE FROM relationships WHERE id NOT IN (
  SELECT r.id FROM relationships r
  JOIN scholars s1 ON r.scholar_id = s1.id
  JOIN scholars s2 ON r.related_scholar_id = s2.id
  WHERE s1.name_english IN (
    'Abd al-Rahman ibn Umar al-Zayla''i',
    'Ahmad ibn Abdullah al-Harari', 
    'Muhammad ibn Ibrahim al-Maqdishi',
    'Uthman ibn Ali al-Berberi',
    'Fatima bint Ahmad al-Zayla''iya'
  ) AND s2.name_english IN (
    'Abd al-Rahman ibn Umar al-Zayla''i',
    'Ahmad ibn Abdullah al-Harari', 
    'Muhammad ibn Ibrahim al-Maqdishi',
    'Uthman ibn Ali al-Berberi',
    'Fatima bint Ahmad al-Zayla''iya'
  )
);

DELETE FROM scholars WHERE name_english NOT IN (
  'Abd al-Rahman ibn Umar al-Zayla''i',
  'Ahmad ibn Abdullah al-Harari', 
  'Muhammad ibn Ibrahim al-Maqdishi',
  'Uthman ibn Ali al-Berberi',
  'Fatima bint Ahmad al-Zayla''iya'
);

-- Insert 25 new scholars
INSERT INTO scholars (
  name_english, name_arabic, name_somali, birth_year, death_year, 
  birth_location, death_location, specializations, biography
) VALUES
-- Scholar #1 - Ibrahim Hashi Mahmoud  
('Ibrahim Hashi Mahmoud', 'إبراهيم حاشي محمود', null, 1929, null, 
 'Huddur, Somalia', null, 
 ARRAY['Shafi Jurisprudence', 'Arabic Grammar', 'Somali Language Development', 'Islamic Legal Systems', 'Cultural Writing'],
 '20th century scholar from Huddur, Somalia. Specialist in Shafi jurisprudence and Somali language development.'),

-- Scholar #2 - Ibrahim Sheikh Ishaq
('Ibrahim Sheikh Ishaq', 'إبراهيم شيخ إسحاق', null, null, null,
 'Kenya/Somalia border region', null,
 ARRAY['Usul al-Fiqh', 'Islamic Da''wa', 'Educational Leadership'],
 '20th century scholar from the Kenya/Somalia border region. Expert in Usul al-Fiqh and Islamic da''wa.'),

-- Scholar #3 - Ibrahim Sayyid Muhammad Qulid  
('Ibrahim Sayyid Muhammad Qulid', 'إبراهيم سيد محمد قوليد', null, null, null,
 'Middle Shabelle, Somalia', null,
 ARRAY['Salihiyya Sufism', 'Sufi Biography', 'Religious Leadership'],
 '20th century Sufi scholar from Middle Shabelle. Leader in the Salihiyya Sufi order.'),

-- Scholar #4 - Ibrahim Abd al-Qadir Muhammad
('Ibrahim Abd al-Qadir Muhammad', 'إبراهيم عبد القادر محمد', null, 1992, null,
 'Mecca', 'Bosaso',
 ARRAY['International Relations', 'Islamic Diplomacy', 'Sharia Studies', 'Islamic History'],
 '21st century scholar born in Mecca. Contemporary expert in Islamic diplomacy and international relations.'),

-- Scholar #5 - Ibrahim Abdullah Muhammad
('Ibrahim Abdullah Muhammad', 'إبراهيم عبد الله محمد', null, 1921, 2010,
 'Qalafo, Western Somalia', null,
 ARRAY['Islamic Liberation Movements', 'Horn of Africa History', 'Islamic Political Leadership', 'Educational Administration'],
 '20th century scholar and political leader from Qalafo. Expert in Islamic liberation movements and Horn of Africa history.'),

-- Scholar #6 - Ibrahim Sheikh Abdi
('Ibrahim Sheikh Abdi', 'إبراهيم شيخ عبدي', null, 1966, null,
 'Taghebur, Western Somalia', null,
 ARRAY['Shafi Jurisprudence', 'Comparative Fiqh', 'Hadith Studies', 'Islamic Education'],
 '20th-21st century scholar from Taghebur. Expert in Shafi jurisprudence and comparative fiqh studies.'),

-- Scholar #7 - Ibrahim Umar Ahmad Bashir
('Ibrahim Umar Ahmad Bashir', 'إبراهيم عمر أحمد بشير', null, 1920, 1982,
 'Western Somalia', 'Djibouti',
 ARRAY['Educational Administration', 'Human Resource Management', 'University Management', 'Business Administration'],
 '20th century educator from Western Somalia. Pioneer in educational administration, died in Djibouti.'),

-- Scholar #8 - Ibrahim Muhammad Mursal
('Ibrahim Muhammad Mursal', 'إبراهيم محمد مرسل', null, 1968, null,
 'Somalia', null,
 ARRAY['Media Studies', 'Press Management', 'Development Communication', 'University Administration'],
 '20th-21st century media specialist from Somalia. Expert in development communication and press management.'),

-- Scholar #9 - Ibrahim Muhammad Nur
('Ibrahim Muhammad Nur', 'إبراهيم محمد نور', null, 1980, null,
 'Dameerka (Dar al-Salam), Middle Juba', null,
 ARRAY['Arabic Language Education', 'Teacher Training', 'Curriculum Development', 'Educational Research'],
 '21st century educator from Middle Juba. Specialist in Arabic language education and curriculum development.'),

-- Scholar #10 - Ibrahim Muallim Amin
('Ibrahim Muallim Amin', 'إبراهيم معلم أمين', null, 1970, null,
 'Mandera, Northern Kenya', null,
 ARRAY['Arabic Language Curriculum', 'Educational Methodology', 'Islamic Education', 'Academic Administration'],
 '20th-21st century educator from Mandera, Kenya. Expert in Arabic language curriculum and Islamic education.'),

-- Scholar #11 - Abshir Khalif Almi
('Abshir Khalif Almi', 'أبشر خليف علمي', null, 1958, null,
 'Somalia', null,
 ARRAY['Traditional Islamic Education'],
 '20th-21st century traditional Islamic educator from Somalia.'),

-- Scholar #12 - Abshir Umar Husayn
('Abshir Umar Husayn', 'أبشر عمر حسين', null, 1970, null,
 'Somalia', null,
 ARRAY['Traditional Islamic Education'],
 '20th-21st century traditional Islamic educator from Somalia.'),

-- Scholar #13 - Abu Bakr Hasan
('Abu Bakr Hasan', 'أبو بكر حسن', null, 1960, null,
 'Somalia', null,
 ARRAY['Islamic Jurisprudence', 'University Teaching', 'Educational Research'],
 '20th-21st century scholar from Somalia. University teacher specializing in Islamic jurisprudence.'),

-- Scholar #14 - Abu Bakr ibn Ali
('Abu Bakr ibn Ali', 'أبو بكر بن علي', null, 1950, 1985,
 'Dafed, Lower Shabelle', null,
 ARRAY['Arabic Grammar', 'Traditional Islamic Education', 'Quranic Recitation', 'Scholarly Writing'],
 '20th century scholar from Lower Shabelle. Expert in Arabic grammar and Quranic recitation, died young at 35.'),

-- Scholar #15 - Abu Bakr Muallim Qasim
('Abu Bakr Muallim Qasim', 'أبو بكر معلم قاسم', null, 1960, 2009,
 'Somalia', null,
 ARRAY['Traditional Islamic Education', 'Religious Poetry', 'Community Teaching', 'Jurisprudence'],
 '20th-21st century scholar from Somalia. Known for religious poetry and community teaching.'),

-- Scholar #16 - Abu Bakr ibn Muhammad al-Harari (Historical)
('Abu Bakr ibn Muhammad al-Harari', 'أبو بكر بن محمد الهرري', null, 1400, 1451,
 'Harar, Ethiopia', null,
 ARRAY['Islamic Education', 'Arabic Language Teaching', 'Curriculum Development', 'University Administration'],
 '15th century scholar from Harar. Pioneer in Islamic education and Arabic language teaching in the Horn of Africa.'),

-- Scholar #17 - Abu Bakr Muhammad Muallim Hasan
('Abu Bakr Muhammad Muallim Hasan', 'أبو بكر محمد معلم حسن', null, 1965, null,
 'Somalia', null,
 ARRAY['Islamic Jurisprudence', 'Educational Leadership', 'Contemporary Islamic Law', 'Community Teaching'],
 '20th-21st century scholar from Somalia. Expert in contemporary Islamic law and educational leadership.'),

-- Scholar #18 - Abu Bakr Muhammad Abd
('Abu Bakr Muhammad Abd', 'أبو بكر محمد عبد', null, 1945, null,
 'Somalia', null,
 ARRAY['Medicine', 'Healthcare Management', 'Medical Education', 'Public Health Policy'],
 '20th century scholar from Somalia. Pioneering medical professional and healthcare administrator.'),

-- Scholar #19 - Abu Bakr Haj Muhammad
('Abu Bakr Haj Muhammad', 'أبو بكر حاج محمد', null, 1965, null,
 'Somalia', null,
 ARRAY['Educational Research', 'Teaching Methodology', 'Curriculum Development', 'Educational Policy'],
 '20th-21st century educator from Somalia. Expert in educational research and curriculum development.'),

-- Scholar #20 - Abu Bakr Sheikh Nur
('Abu Bakr Sheikh Nur', 'أبو بكر شيخ نور', null, 1960, null,
 'Somalia', null,
 ARRAY['Educational Foundations', 'Educational Research', 'Educational Philosophy', 'Academic Administration'],
 '20th-21st century educator from Somalia. Specialist in educational foundations and philosophy.'),

-- Scholar #21 - Ahmad Abu Bakr Uthman
('Ahmad Abu Bakr Uthman', 'أحمد أبو بكر عثمان', null, 1982, null,
 'Afgoye, Lower Shabelle', null,
 ARRAY['Traditional Islamic Education', 'Community Religious Leadership', 'Islamic Jurisprudence', 'Local Teaching'],
 '21st century scholar from Afgoye. Community religious leader and traditional Islamic educator.'),

-- Scholar #22 - Ahmad Ahmad
('Ahmad Ahmad', 'أحمد أحمد', null, 1950, null,
 'Somalia', null,
 ARRAY['Arabic Language Studies', 'Arabic Literature', 'Linguistic Research', 'Academic Writing'],
 '20th-21st century linguist from Somalia. Expert in Arabic language studies and literature.'),

-- Scholar #23 - Ahmad Burkha Mah
('Ahmad Burkha Mah', 'أحمد برخ ماح', null, 1930, 2009,
 'Northern Somalia', null,
 ARRAY['Somali Literature', 'Creative Writing', 'Literary Analysis', 'Cultural Expression'],
 '20th century literary scholar from Northern Somalia. Pioneer in Somali literature and creative writing.'),

-- Scholar #24 - Ahmad Bashir ibn Muhammad
('Ahmad Bashir ibn Muhammad', 'أحمد بشير بن محمد', null, 1920, 1982,
 'Western Somalia', 'Djibouti',
 ARRAY['Traditional Islamic Education', 'Religious Teaching', 'Community Leadership', 'Islamic Guidance'],
 '20th century religious teacher from Western Somalia. Community leader who died in Djibouti.'),

-- Scholar #25 - Ahmad Jami Ismail
('Ahmad Jami Ismail', 'أحمد جامع إسماعيل', null, 1950, null,
 'Sanag, Northern Somalia', null,
 ARRAY['Academic Research', 'Educational Leadership', 'Scholarly Writing', 'University Administration'],
 '20th-21st century academic from Sanag region. Expert in educational leadership and scholarly research.');

-- Add some sample relationships between these scholars
-- First get the IDs of the newly inserted scholars
WITH scholar_lookup AS (
  SELECT 
    id,
    name_english,
    ROW_NUMBER() OVER (ORDER BY name_english) as rn
  FROM scholars 
  WHERE name_english IN (
    'Ibrahim Hashi Mahmoud', 'Ibrahim Sheikh Ishaq', 'Ibrahim Sayyid Muhammad Qulid',
    'Ibrahim Abd al-Qadir Muhammad', 'Ibrahim Abdullah Muhammad', 'Ibrahim Sheikh Abdi',
    'Ibrahim Umar Ahmad Bashir', 'Ibrahim Muhammad Mursal', 'Ibrahim Muhammad Nur',
    'Ibrahim Muallim Amin', 'Abu Bakr ibn Ali', 'Ahmad Abu Bakr Uthman',
    'Abu Bakr ibn Muhammad al-Harari', 'Ahmad Bashir ibn Muhammad', 'Ahmad Jami Ismail'
  )
)
INSERT INTO relationships (scholar_id, related_scholar_id, relationship_type)
SELECT 
  s1.id, s2.id, 'teacher'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ibrahim Abdullah Muhammad' AND s2.name_english = 'Ibrahim Hashi Mahmoud'
UNION ALL
SELECT 
  s1.id, s2.id, 'teacher'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ibrahim Hashi Mahmoud' AND s2.name_english = 'Ibrahim Sheikh Ishaq'
UNION ALL
SELECT 
  s1.id, s2.id, 'teacher'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Abu Bakr ibn Muhammad al-Harari' AND s2.name_english = 'Abu Bakr ibn Ali'
UNION ALL
-- Contemporary relationships
SELECT 
  s1.id, s2.id, 'contemporary'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ibrahim Hashi Mahmoud' AND s2.name_english = 'Ibrahim Abdullah Muhammad'
UNION ALL
SELECT 
  s1.id, s2.id, 'contemporary'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ibrahim Sheikh Ishaq' AND s2.name_english = 'Ibrahim Sayyid Muhammad Qulid'
UNION ALL
SELECT 
  s1.id, s2.id, 'contemporary'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ibrahim Sheikh Abdi' AND s2.name_english = 'Ibrahim Umar Ahmad Bashir'
UNION ALL
SELECT 
  s1.id, s2.id, 'contemporary'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ahmad Bashir ibn Muhammad' AND s2.name_english = 'Ahmad Jami Ismail'
UNION ALL
-- Location-based relationships
SELECT 
  s1.id, s2.id, 'location_based'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Abu Bakr ibn Ali' AND s2.name_english = 'Ahmad Abu Bakr Uthman' -- Both from Lower Shabelle area
UNION ALL
SELECT 
  s1.id, s2.id, 'location_based'
FROM scholar_lookup s1, scholar_lookup s2
WHERE s1.name_english = 'Ibrahim Umar Ahmad Bashir' AND s2.name_english = 'Ahmad Bashir ibn Muhammad'; -- Both from Western Somalia