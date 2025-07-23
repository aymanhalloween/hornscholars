-- Horn Scholars Database Schema
-- This creates the complete database structure for the Somali Islamic scholarship platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create scholars table
CREATE TABLE scholars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_arabic TEXT NOT NULL,
    name_english TEXT NOT NULL,
    name_somali TEXT,
    birth_year INTEGER CHECK (birth_year > 800 AND birth_year <= 2100),
    death_year INTEGER CHECK (death_year > 800 AND death_year <= 2100),
    birth_location TEXT,
    death_location TEXT,
    biography TEXT,
    specializations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector TSVECTOR
);

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    country TEXT,
    region TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationships table for scholar connections
CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholar_id UUID NOT NULL REFERENCES scholars(id) ON DELETE CASCADE,
    related_scholar_id UUID NOT NULL REFERENCES scholars(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('teacher', 'student', 'contemporary', 'location_based')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scholar_id, related_scholar_id, relationship_type),
    CHECK (scholar_id != related_scholar_id)
);

-- Create scholar_locations junction table
CREATE TABLE scholar_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholar_id UUID NOT NULL REFERENCES scholars(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    location_type TEXT NOT NULL CHECK (location_type IN ('birth', 'study', 'residence', 'death')),
    start_year INTEGER,
    end_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_year IS NULL OR start_year IS NULL OR end_year >= start_year)
);

-- Create works table for scholarly works database
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_arabic TEXT NOT NULL,
    title_english TEXT,
    title_transliteration TEXT,
    composition_year INTEGER,
    composition_location TEXT,
    subject_area TEXT[],
    manuscript_status TEXT NOT NULL CHECK (manuscript_status IN ('published', 'manuscript', 'lost', 'unknown')) DEFAULT 'unknown',
    description TEXT,
    notes TEXT,
    pages INTEGER,
    language TEXT DEFAULT 'Arabic',
    genre TEXT, -- e.g., 'Fiqh treatise', 'Quranic commentary', 'Poetry collection'
    extant_copies INTEGER DEFAULT 0,
    library_locations TEXT[], -- Where manuscripts are held
    publication_details TEXT, -- Modern publication info if published
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector TSVECTOR
);

-- Create work_authors junction table (many-to-many: works can have multiple authors, scholars can have multiple works)
CREATE TABLE work_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    scholar_id UUID NOT NULL REFERENCES scholars(id) ON DELETE CASCADE,
    author_role TEXT DEFAULT 'author' CHECK (author_role IN ('author', 'co-author', 'translator', 'commentator', 'editor')),
    attribution_certainty TEXT DEFAULT 'certain' CHECK (attribution_certainty IN ('certain', 'probable', 'disputed', 'false')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_id, scholar_id, author_role)
);

-- Create work_relationships table for works that reference, comment on, or respond to other works
CREATE TABLE work_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    target_work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('commentary', 'response', 'refutation', 'summary', 'translation', 'quotation')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_work_id, target_work_id, relationship_type),
    CHECK (source_work_id != target_work_id)
);

-- Create indexes for performance
CREATE INDEX idx_scholars_search_vector ON scholars USING GIN (search_vector);
CREATE INDEX idx_scholars_name_english ON scholars (name_english);
CREATE INDEX idx_scholars_name_arabic ON scholars (name_arabic);
CREATE INDEX idx_scholars_birth_year ON scholars (birth_year);
CREATE INDEX idx_scholars_death_year ON scholars (death_year);
CREATE INDEX idx_relationships_scholar_id ON relationships (scholar_id);
CREATE INDEX idx_relationships_related_scholar_id ON relationships (related_scholar_id);
CREATE INDEX idx_relationships_type ON relationships (relationship_type);
CREATE INDEX idx_scholar_locations_scholar_id ON scholar_locations (scholar_id);
CREATE INDEX idx_scholar_locations_location_id ON scholar_locations (location_id);

-- Indexes for works tables
CREATE INDEX idx_works_search_vector ON works USING GIN (search_vector);
CREATE INDEX idx_works_title_arabic ON works (title_arabic);
CREATE INDEX idx_works_title_english ON works (title_english);
CREATE INDEX idx_works_manuscript_status ON works (manuscript_status);
CREATE INDEX idx_works_composition_year ON works (composition_year);
CREATE INDEX idx_works_subject_area ON works USING GIN (subject_area);
CREATE INDEX idx_work_authors_work_id ON work_authors (work_id);
CREATE INDEX idx_work_authors_scholar_id ON work_authors (scholar_id);
CREATE INDEX idx_work_relationships_source ON work_relationships (source_work_id);
CREATE INDEX idx_work_relationships_target ON work_relationships (target_work_id);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_scholar_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := setweight(to_tsvector('simple', NEW.name_english), 'A') ||
                        setweight(to_tsvector('simple', NEW.name_arabic), 'A') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.name_somali, '')), 'A') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.biography, '')), 'B') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.birth_location, '')), 'B') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.death_location, '')), 'B') ||
                        setweight(to_tsvector('simple', array_to_string(COALESCE(NEW.specializations, '{}'), ' ')), 'B');
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER tr_scholars_search_vector
    BEFORE INSERT OR UPDATE ON scholars
    FOR EACH ROW EXECUTE FUNCTION update_scholar_search_vector();

-- Function to update works search vector
CREATE OR REPLACE FUNCTION update_works_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := setweight(to_tsvector('simple', NEW.title_arabic), 'A') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.title_english, '')), 'A') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.title_transliteration, '')), 'A') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.composition_location, '')), 'B') ||
                        setweight(to_tsvector('simple', COALESCE(NEW.genre, '')), 'B') ||
                        setweight(to_tsvector('simple', array_to_string(COALESCE(NEW.subject_area, '{}'), ' ')), 'B');
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update works search vector
CREATE TRIGGER tr_works_search_vector
    BEFORE INSERT OR UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_works_search_vector();

-- Function for multilingual fuzzy search
CREATE OR REPLACE FUNCTION search_scholars(
    search_query TEXT,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    name_arabic TEXT,
    name_english TEXT,
    name_somali TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    birth_location TEXT,
    death_location TEXT,
    biography TEXT,
    specializations TEXT[],
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name_arabic,
        s.name_english,
        s.name_somali,
        s.birth_year,
        s.death_year,
        s.birth_location,
        s.death_location,
        s.biography,
        s.specializations,
        (ts_rank(s.search_vector, plainto_tsquery('simple', search_query)) +
         CASE 
            WHEN s.name_english ILIKE '%' || search_query || '%' THEN 0.5
            WHEN s.name_arabic ILIKE '%' || search_query || '%' THEN 0.5
            WHEN s.name_somali ILIKE '%' || search_query || '%' THEN 0.5
            WHEN s.birth_location ILIKE '%' || search_query || '%' THEN 0.3
            WHEN s.death_location ILIKE '%' || search_query || '%' THEN 0.3
            ELSE 0
         END +
         CASE
            WHEN similarity(s.name_english, search_query) > 0.3 THEN similarity(s.name_english, search_query) * 0.3
            WHEN similarity(s.name_arabic, search_query) > 0.3 THEN similarity(s.name_arabic, search_query) * 0.3
            WHEN s.name_somali IS NOT NULL AND similarity(s.name_somali, search_query) > 0.3 THEN similarity(s.name_somali, search_query) * 0.3
            ELSE 0
         END
        )::REAL as relevance_score
    FROM scholars s
    WHERE 
        s.search_vector @@ plainto_tsquery('simple', search_query) OR
        s.name_english ILIKE '%' || search_query || '%' OR
        s.name_arabic ILIKE '%' || search_query || '%' OR
        s.name_somali ILIKE '%' || search_query || '%' OR
        s.birth_location ILIKE '%' || search_query || '%' OR
        s.death_location ILIKE '%' || search_query || '%' OR
        similarity(s.name_english, search_query) > 0.3 OR
        similarity(s.name_arabic, search_query) > 0.3 OR
        (s.name_somali IS NOT NULL AND similarity(s.name_somali, search_query) > 0.3)
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for public access
ALTER TABLE scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholar_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public scholarly resource)
CREATE POLICY "Public scholars read access" ON scholars FOR SELECT USING (true);
CREATE POLICY "Public locations read access" ON locations FOR SELECT USING (true);
CREATE POLICY "Public relationships read access" ON relationships FOR SELECT USING (true);
CREATE POLICY "Public scholar_locations read access" ON scholar_locations FOR SELECT USING (true);
CREATE POLICY "Public works read access" ON works FOR SELECT USING (true);
CREATE POLICY "Public work_authors read access" ON work_authors FOR SELECT USING (true);
CREATE POLICY "Public work_relationships read access" ON work_relationships FOR SELECT USING (true);

-- Insert sample locations (major centers of Islamic learning in Horn of Africa)
INSERT INTO locations (name, latitude, longitude, country, region) VALUES
('Harar', 9.3125, 42.1188, 'Ethiopia', 'Harari Region'),
('Zeila', 11.3583, 43.4625, 'Somalia', 'Awdal Region'),
('Mogadishu', 2.0469, 45.3182, 'Somalia', 'Banaadir'),
('Berbera', 10.4396, 45.0143, 'Somalia', 'Woqooyi Galbeed'),
('Jigjiga', 9.3497, 42.7948, 'Ethiopia', 'Somali Region'),
('Dire Dawa', 9.5938, 41.8547, 'Ethiopia', 'Dire Dawa'),
('Mecca', 21.4225, 39.8262, 'Saudi Arabia', 'Makkah Province'),
('Medina', 24.4683, 39.6142, 'Saudi Arabia', 'Al Madinah Province'),
('Cairo', 30.0444, 31.2357, 'Egypt', 'Cairo Governorate'),
('Damascus', 33.5138, 36.2765, 'Syria', 'Damascus Governorate'),
('Baghdad', 33.3128, 44.3615, 'Iraq', 'Baghdad Governorate')
ON CONFLICT (name) DO NOTHING;

-- Sample scholars data (first 5 for testing)
INSERT INTO scholars (name_arabic, name_english, name_somali, birth_year, death_year, biography, specializations) VALUES
('عبد الرحمن بن عمر الزيلعي', 'Abd al-Rahman ibn Umar al-Zayla''i', 'Cabdiraxmaan ibn Cumar al-Zayla''i', 1420, 1495, 'Renowned Somali Islamic scholar from Zeila, known for his contributions to Hanafi jurisprudence and his extensive travels throughout the Islamic world for learning.', ARRAY['Fiqh', 'Hadith', 'Hanafi Jurisprudence']),
('أحمد بن عبد الله الهراري', 'Ahmad ibn Abdullah al-Harari', 'Axmed ibn Cabdullaahi al-Harari', 1380, 1460, 'Influential scholar from Harar, contributed significantly to Islamic theology and maintained correspondence with scholars across the Islamic world.', ARRAY['Theology', 'Sufism', 'Arabic Literature']),
('محمد بن إبراهيم المقدشي', 'Muhammad ibn Ibrahim al-Maqdishi', 'Maxamed ibn Ibraahim al-Maqdishi', 1450, 1530, 'Prominent Mogadishu-based scholar who played a key role in Islamic education and legal scholarship in the Horn of Africa.', ARRAY['Islamic Law', 'Education', 'Quranic Studies']),
('عثمان بن علي البربري', 'Uthman ibn Ali al-Berberi', 'Cushmaan ibn Cali al-Berberi', 1470, 1550, 'Scholar from Berbera known for his work in Islamic astronomy and mathematics, bridging traditional Islamic sciences with practical applications.', ARRAY['Astronomy', 'Mathematics', 'Islamic Sciences']),
('فاطمة بنت أحمد الزيلعية', 'Fatima bint Ahmad al-Zayla''iya', 'Faaduma bint Axmed al-Zayla''iya', 1490, 1570, 'Notable female scholar from Zeila, recognized for her expertise in Islamic jurisprudence and her role in educating women in Islamic sciences.', ARRAY['Islamic Jurisprudence', 'Women''s Education', 'Hadith Studies']);

-- Create some sample relationships
WITH scholar_ids AS (
  SELECT id, name_english FROM scholars WHERE name_english IN (
    'Abd al-Rahman ibn Umar al-Zayla''i',
    'Ahmad ibn Abdullah al-Harari', 
    'Muhammad ibn Ibrahim al-Maqdishi',
    'Uthman ibn Ali al-Berberi',
    'Fatima bint Ahmad al-Zayla''iya'
  )
)
INSERT INTO relationships (scholar_id, related_scholar_id, relationship_type)
SELECT 
  s1.id, 
  s2.id, 
  'teacher'
FROM scholar_ids s1, scholar_ids s2
WHERE s1.name_english = 'Abd al-Rahman ibn Umar al-Zayla''i' 
  AND s2.name_english = 'Muhammad ibn Ibrahim al-Maqdishi'
UNION ALL
SELECT 
  s1.id, 
  s2.id, 
  'contemporary'
FROM scholar_ids s1, scholar_ids s2
WHERE s1.name_english = 'Ahmad ibn Abdullah al-Harari' 
  AND s2.name_english = 'Abd al-Rahman ibn Umar al-Zayla''i';

-- Link scholars to their locations
WITH scholar_location_data AS (
  SELECT 
    s.id as scholar_id,
    l.id as location_id,
    CASE 
      WHEN s.name_english LIKE '%Zayla%' THEN 'Zeila'
      WHEN s.name_english LIKE '%Harari%' THEN 'Harar'
      WHEN s.name_english LIKE '%Maqdishi%' THEN 'Mogadishu'
      WHEN s.name_english LIKE '%Berberi%' THEN 'Berbera'
    END as location_name
  FROM scholars s, locations l
  WHERE (s.name_english LIKE '%Zayla%' AND l.name = 'Zeila') OR
        (s.name_english LIKE '%Harari%' AND l.name = 'Harar') OR
        (s.name_english LIKE '%Maqdishi%' AND l.name = 'Mogadishu') OR
        (s.name_english LIKE '%Berberi%' AND l.name = 'Berbera')
)
INSERT INTO scholar_locations (scholar_id, location_id, location_type, start_year, end_year)
SELECT scholar_id, location_id, 'birth', null, null FROM scholar_location_data;

-- Insert sample scholarly works
INSERT INTO works (
  title_arabic, title_english, title_transliteration, 
  composition_year, composition_location, subject_area, 
  manuscript_status, description, genre, language
) VALUES
('الجوهر المكنون في علوم الدين المأمون', 'The Hidden Jewel in the Sciences of Reliable Religion', 'al-Jawhar al-Maknun fi Ulum al-Din al-Mamun', 
 1480, 'Zeila', ARRAY['Theology', 'Islamic Jurisprudence'], 'manuscript', 
 'A comprehensive treatise on Islamic theology and jurisprudence, covering fundamental principles of faith and law according to the Shafi school.', 
 'Theological treatise', 'Arabic'),

('مناهج الطالبين في فقه الدين', 'Methods of Students in Religious Jurisprudence', 'Manahij al-Talibin fi Fiqh al-Din',
 1465, 'Harar', ARRAY['Fiqh', 'Islamic Law'], 'manuscript',
 'A detailed guide for students of Islamic jurisprudence, focusing on practical applications of Shafi legal methodology.',
 'Legal manual', 'Arabic'),

('ديوان الأشعار الصوفية', 'Collection of Sufi Poetry', 'Diwan al-Ashar al-Sufiyya',
 1520, 'Mogadishu', ARRAY['Sufism', 'Poetry', 'Spirituality'], 'lost',
 'A collection of mystical poetry exploring Sufi themes of divine love, spiritual purification, and the path to God.',
 'Poetry collection', 'Arabic'),

('الرسالة في آداب العلم والتعليم', 'Treatise on the Ethics of Knowledge and Teaching', 'al-Risala fi Adab al-Ilm wa al-Talim',
 1495, 'Berbera', ARRAY['Education', 'Ethics', 'Islamic Pedagogy'], 'manuscript',
 'A guide for teachers and students on the proper conduct, ethics, and methods of Islamic education.',
 'Educational treatise', 'Arabic'),

('تفسير سورة الفاتحة', 'Commentary on Surat al-Fatiha', 'Tafsir Surat al-Fatiha',
 1475, 'Zeila', ARRAY['Quranic Studies', 'Exegesis'], 'published',
 'A detailed exegetical work on the opening chapter of the Quran, exploring linguistic, theological, and spiritual dimensions.',
 'Quranic commentary', 'Arabic');

-- Link works to their authors
WITH work_author_data AS (
  SELECT 
    w.id as work_id,
    s.id as scholar_id,
    w.title_english,
    s.name_english
  FROM works w, scholars s
  WHERE (w.title_english = 'The Hidden Jewel in the Sciences of Reliable Religion' AND s.name_english = 'Abd al-Rahman ibn Umar al-Zayla''i') OR
        (w.title_english = 'Methods of Students in Religious Jurisprudence' AND s.name_english = 'Ahmad ibn Abdullah al-Harari') OR
        (w.title_english = 'Collection of Sufi Poetry' AND s.name_english = 'Muhammad ibn Ibrahim al-Maqdishi') OR
        (w.title_english = 'Treatise on the Ethics of Knowledge and Teaching' AND s.name_english = 'Uthman ibn Ali al-Berberi') OR
        (w.title_english = 'Commentary on Surat al-Fatiha' AND s.name_english = 'Fatima bint Ahmad al-Zayla''iya')
)
INSERT INTO work_authors (work_id, scholar_id, author_role, attribution_certainty)
SELECT work_id, scholar_id, 'author', 'certain' FROM work_author_data;