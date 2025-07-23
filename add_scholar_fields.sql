-- Add enhanced fields for scholarly achievements and teaching history
ALTER TABLE scholars 
ADD COLUMN IF NOT EXISTS major_works text[], 
ADD COLUMN IF NOT EXISTS teaching_positions text[],
ADD COLUMN IF NOT EXISTS scholarly_achievements text[],
ADD COLUMN IF NOT EXISTS students text[],
ADD COLUMN IF NOT EXISTS notable_contributions text,
ADD COLUMN IF NOT EXISTS intellectual_lineage text,
ADD COLUMN IF NOT EXISTS manuscripts_authored integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS teaching_years_start integer,
ADD COLUMN IF NOT EXISTS teaching_years_end integer;

-- Add comments for documentation
COMMENT ON COLUMN scholars.major_works IS 'Array of major works and publications by the scholar';
COMMENT ON COLUMN scholars.teaching_positions IS 'Array of teaching positions held (e.g., "Imam at Harar Mosque", "Professor at Al-Azhar")';
COMMENT ON COLUMN scholars.scholarly_achievements IS 'Array of notable achievements and recognitions';
COMMENT ON COLUMN scholars.students IS 'Array of notable students or disciples';
COMMENT ON COLUMN scholars.notable_contributions IS 'Description of major intellectual contributions';
COMMENT ON COLUMN scholars.intellectual_lineage IS 'Description of scholarly lineage and influences';
COMMENT ON COLUMN scholars.manuscripts_authored IS 'Number of manuscripts or works authored';
COMMENT ON COLUMN scholars.teaching_years_start IS 'Year when teaching career began';
COMMENT ON COLUMN scholars.teaching_years_end IS 'Year when teaching career ended';

-- Update search function to include new fields
CREATE OR REPLACE FUNCTION search_scholars(search_query text, limit_count integer DEFAULT 20)
RETURNS TABLE (
    id uuid,
    name_arabic text,
    name_english text,
    name_somali text,
    birth_year integer,
    death_year integer,
    birth_location text,
    death_location text,
    biography text,
    specializations text[],
    major_works text[],
    teaching_positions text[],
    scholarly_achievements text[],
    notable_contributions text,
    relevance_score real
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
        s.major_works,
        s.teaching_positions,
        s.scholarly_achievements,
        s.notable_contributions,
        ts_rank(s.search_vector, websearch_to_tsquery('english', search_query)) as relevance_score
    FROM scholars s
    WHERE s.search_vector @@ websearch_to_tsquery('english', search_query)
       OR s.name_english ILIKE '%' || search_query || '%'
       OR s.name_arabic ILIKE '%' || search_query || '%'
       OR s.name_somali ILIKE '%' || search_query || '%'
       OR EXISTS (
           SELECT 1 FROM unnest(s.specializations) spec 
           WHERE spec ILIKE '%' || search_query || '%'
       )
       OR EXISTS (
           SELECT 1 FROM unnest(s.major_works) work 
           WHERE work ILIKE '%' || search_query || '%'
       )
       OR EXISTS (
           SELECT 1 FROM unnest(s.teaching_positions) pos 
           WHERE pos ILIKE '%' || search_query || '%'
       )
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Update search vector trigger to include new fields
CREATE OR REPLACE FUNCTION update_scholar_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name_english, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.name_arabic, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.name_somali, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.biography, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.specializations, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.major_works, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.teaching_positions, ' '), '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.notable_contributions, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.birth_location, '')), 'D') ||
        setweight(to_tsvector('english', COALESCE(NEW.death_location, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
EOF < /dev/null