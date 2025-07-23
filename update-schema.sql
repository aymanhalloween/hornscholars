-- Add missing columns to scholars table
ALTER TABLE scholars 
ADD COLUMN birth_location TEXT,
ADD COLUMN death_location TEXT;

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

-- Update the search vector function to include location fields
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

-- Update the search function to return location fields
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

-- Update search vectors for existing scholars
UPDATE scholars SET updated_at = NOW();