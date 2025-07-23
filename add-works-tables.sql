-- Add works database tables to existing Horn Scholars schema
-- This script adds only the new tables and functions needed for scholarly works

-- First, add missing columns to existing scholars table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholars' AND column_name = 'birth_location') THEN
        ALTER TABLE scholars ADD COLUMN birth_location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholars' AND column_name = 'death_location') THEN
        ALTER TABLE scholars ADD COLUMN death_location TEXT;
    END IF;
END $$;

-- Update birth/death year constraints to allow modern dates
ALTER TABLE scholars DROP CONSTRAINT IF EXISTS scholars_birth_year_check;
ALTER TABLE scholars ADD CONSTRAINT scholars_birth_year_check CHECK (birth_year > 800 AND birth_year <= 2100);

ALTER TABLE scholars DROP CONSTRAINT IF EXISTS scholars_death_year_check;
ALTER TABLE scholars ADD CONSTRAINT scholars_death_year_check CHECK (death_year > 800 AND death_year <= 2100);

-- Create works table for scholarly works database (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS works (
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
    genre TEXT,
    extant_copies INTEGER DEFAULT 0,
    library_locations TEXT[],
    publication_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    search_vector TSVECTOR
);

-- Create work_authors junction table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS work_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    scholar_id UUID NOT NULL REFERENCES scholars(id) ON DELETE CASCADE,
    author_role TEXT DEFAULT 'author' CHECK (author_role IN ('author', 'co-author', 'translator', 'commentator', 'editor')),
    attribution_certainty TEXT DEFAULT 'certain' CHECK (attribution_certainty IN ('certain', 'probable', 'disputed', 'false')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(work_id, scholar_id, author_role)
);

-- Create work_relationships table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS work_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    target_work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('commentary', 'response', 'refutation', 'summary', 'translation', 'quotation')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_work_id, target_work_id, relationship_type),
    CHECK (source_work_id != target_work_id)
);

-- Create indexes for works tables (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_works_search_vector ON works USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_works_title_arabic ON works (title_arabic);
CREATE INDEX IF NOT EXISTS idx_works_title_english ON works (title_english);
CREATE INDEX IF NOT EXISTS idx_works_manuscript_status ON works (manuscript_status);
CREATE INDEX IF NOT EXISTS idx_works_composition_year ON works (composition_year);
CREATE INDEX IF NOT EXISTS idx_works_subject_area ON works USING GIN (subject_area);
CREATE INDEX IF NOT EXISTS idx_work_authors_work_id ON work_authors (work_id);
CREATE INDEX IF NOT EXISTS idx_work_authors_scholar_id ON work_authors (scholar_id);
CREATE INDEX IF NOT EXISTS idx_work_relationships_source ON work_relationships (source_work_id);
CREATE INDEX IF NOT EXISTS idx_work_relationships_target ON work_relationships (target_work_id);

-- Update the scholars search vector function to include location fields
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

-- Create works search vector function
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

-- Create trigger for works search vector (drop first if exists)
DROP TRIGGER IF EXISTS tr_works_search_vector ON works;
CREATE TRIGGER tr_works_search_vector
    BEFORE INSERT OR UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_works_search_vector();

-- Drop and recreate the search function to include location fields
DROP FUNCTION IF EXISTS search_scholars(text, integer);

CREATE FUNCTION search_scholars(
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

-- Enable RLS for new works tables
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (drop first if they exist)
DROP POLICY IF EXISTS "Public works read access" ON works;
DROP POLICY IF EXISTS "Public work_authors read access" ON work_authors;
DROP POLICY IF EXISTS "Public work_relationships read access" ON work_relationships;

CREATE POLICY "Public works read access" ON works FOR SELECT USING (true);
CREATE POLICY "Public work_authors read access" ON work_authors FOR SELECT USING (true);
CREATE POLICY "Public work_relationships read access" ON work_relationships FOR SELECT USING (true);

-- Insert sample scholarly works (only if no works exist yet)
INSERT INTO works (
  title_arabic, title_english, title_transliteration, 
  composition_year, composition_location, subject_area, 
  manuscript_status, description, genre, language
) 
SELECT * FROM (VALUES
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
   'Quranic commentary', 'Arabic')
) AS v(title_arabic, title_english, title_transliteration, composition_year, composition_location, subject_area, manuscript_status, description, genre, language)
WHERE NOT EXISTS (SELECT 1 FROM works LIMIT 1);

-- Link works to their authors (only if work_authors table is empty)
INSERT INTO work_authors (work_id, scholar_id, author_role, attribution_certainty)
SELECT 
  w.id as work_id,
  s.id as scholar_id,
  'author' as author_role,
  'certain' as attribution_certainty
FROM works w, scholars s
WHERE (w.title_english = 'The Hidden Jewel in the Sciences of Reliable Religion' AND s.name_english = 'Abd al-Rahman ibn Umar al-Zayla''i') OR
      (w.title_english = 'Methods of Students in Religious Jurisprudence' AND s.name_english = 'Ahmad ibn Abdullah al-Harari') OR
      (w.title_english = 'Collection of Sufi Poetry' AND s.name_english = 'Muhammad ibn Ibrahim al-Maqdishi') OR
      (w.title_english = 'Treatise on the Ethics of Knowledge and Teaching' AND s.name_english = 'Uthman ibn Ali al-Berberi') OR
      (w.title_english = 'Commentary on Surat al-Fatiha' AND s.name_english = 'Fatima bint Ahmad al-Zayla''iya')
AND NOT EXISTS (SELECT 1 FROM work_authors LIMIT 1);

-- Update search vectors for existing scholars to include location fields
UPDATE scholars SET updated_at = NOW() WHERE birth_location IS NOT NULL OR death_location IS NOT NULL;