-- Enhanced Scholar Fields Migration
-- Add new fields for scholarly achievements and teaching history

-- Add the new columns to scholars table
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

-- Add constraints
ALTER TABLE scholars ADD CONSTRAINT check_teaching_years 
CHECK (teaching_years_start IS NULL OR teaching_years_end IS NULL OR teaching_years_start <= teaching_years_end);

ALTER TABLE scholars ADD CONSTRAINT check_manuscripts_authored 
CHECK (manuscripts_authored >= 0);

-- Update the search function (drop and recreate)
DROP FUNCTION IF EXISTS search_scholars(text, integer);

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
) 
LANGUAGE plpgsql
AS $$
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
        CASE 
            WHEN s.search_vector IS NOT NULL AND search_query != '' THEN
                ts_rank(s.search_vector, websearch_to_tsquery('english', search_query))
            ELSE 1.0
        END as relevance_score
    FROM scholars s
    WHERE search_query = '' OR (
        (s.search_vector IS NOT NULL AND s.search_vector @@ websearch_to_tsquery('english', search_query))
        OR s.name_english ILIKE '%' || search_query || '%'
        OR s.name_arabic ILIKE '%' || search_query || '%'
        OR (s.name_somali IS NOT NULL AND s.name_somali ILIKE '%' || search_query || '%')
        OR (s.biography IS NOT NULL AND s.biography ILIKE '%' || search_query || '%')
        OR EXISTS (
            SELECT 1 FROM unnest(COALESCE(s.specializations, ARRAY[]::text[])) spec 
            WHERE spec ILIKE '%' || search_query || '%'
        )
        OR EXISTS (
            SELECT 1 FROM unnest(COALESCE(s.major_works, ARRAY[]::text[])) work 
            WHERE work ILIKE '%' || search_query || '%'
        )
        OR EXISTS (
            SELECT 1 FROM unnest(COALESCE(s.teaching_positions, ARRAY[]::text[])) pos 
            WHERE pos ILIKE '%' || search_query || '%'
        )
        OR (s.notable_contributions IS NOT NULL AND s.notable_contributions ILIKE '%' || search_query || '%')
    )
    ORDER BY relevance_score DESC
    LIMIT limit_count;
END;
$$;

-- Update the search vector trigger function
CREATE OR REPLACE FUNCTION update_scholar_search_vector()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
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
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS scholars_search_vector_update ON scholars;
CREATE TRIGGER scholars_search_vector_update 
    BEFORE INSERT OR UPDATE ON scholars 
    FOR EACH ROW 
    EXECUTE FUNCTION update_scholar_search_vector();

-- Update existing search vectors for all scholars (this might take a moment)
UPDATE scholars SET updated_at = NOW();