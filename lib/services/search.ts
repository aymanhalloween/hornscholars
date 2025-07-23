import { supabase } from '@/lib/supabase/client'
import type { Scholar, SearchResult, SearchFilters } from '@/lib/types'

export interface SearchOptions extends SearchFilters {
  limit?: number
}

export async function searchScholars(
  query: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { limit = 20, location, century, school_of_thought, specialization } = options

  try {
    // Use the database function for fuzzy search
    const { data, error } = await supabase.rpc('search_scholars', {
      search_query: query,
      limit_count: limit
    })

    if (error) {
      console.error('Search error:', error)
      return []
    }

    if (!data) return []

    // Transform the results into SearchResult format
    const results: SearchResult[] = data.map((item: any) => ({
      scholar: {
        id: item.id,
        name_arabic: item.name_arabic,
        name_english: item.name_english,
        name_somali: item.name_somali,
        birth_year: item.birth_year,
        death_year: item.death_year,
        birth_location: item.birth_location,
        death_location: item.death_location,
        biography: item.biography,
        specializations: item.specializations || [],
        major_works: item.major_works || [],
        teaching_positions: item.teaching_positions || [],
        scholarly_achievements: item.scholarly_achievements || [],
        students: item.students || [],
        notable_contributions: item.notable_contributions,
        intellectual_lineage: item.intellectual_lineage,
        manuscripts_authored: item.manuscripts_authored,
        teaching_years_start: item.teaching_years_start,
        teaching_years_end: item.teaching_years_end,
        created_at: '', // Not returned by search function
        updated_at: '', // Not returned by search function
        locations: [], // Will be loaded separately if needed
      },
      relevance_score: item.relevance_score,
      highlighted_fields: getHighlightedFields(query, item),
    }))

    // Apply additional filters if specified
    let filteredResults = results

    if (century) {
      filteredResults = filteredResults.filter(result => {
        const birthCentury = result.scholar.birth_year ? Math.ceil(result.scholar.birth_year / 100) : null
        const deathCentury = result.scholar.death_year ? Math.ceil(result.scholar.death_year / 100) : null
        return birthCentury === century || deathCentury === century
      })
    }

    if (specialization) {
      filteredResults = filteredResults.filter(result => 
        result.scholar.specializations?.some(spec => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
      )
    }

    return filteredResults.sort((a, b) => b.relevance_score - a.relevance_score)

  } catch (error) {
    console.error('Search service error:', error)
    return []
  }
}

export async function getScholarById(id: string): Promise<Scholar | null> {
  try {
    const { data, error } = await supabase
      .from('scholars')
      .select(`
        *,
        scholar_locations (
          location_type,
          start_year,
          end_year,
          locations (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Error fetching scholar:', error)
      return null
    }

    return {
      id: data.id,
      name_arabic: data.name_arabic,
      name_english: data.name_english,
      name_somali: data.name_somali,
      birth_year: data.birth_year,
      death_year: data.death_year,
      birth_location: data.birth_location,
      death_location: data.death_location,
      biography: data.biography,
      specializations: data.specializations || [],
      major_works: data.major_works || [],
      teaching_positions: data.teaching_positions || [],
      scholarly_achievements: data.scholarly_achievements || [],
      students: data.students || [],
      notable_contributions: data.notable_contributions,
      intellectual_lineage: data.intellectual_lineage,
      manuscripts_authored: data.manuscripts_authored,
      teaching_years_start: data.teaching_years_start,
      teaching_years_end: data.teaching_years_end,
      created_at: data.created_at,
      updated_at: data.updated_at,
      locations: data.scholar_locations?.map((sl: any) => ({
        ...sl.locations,
        location_type: sl.location_type,
        start_year: sl.start_year,
        end_year: sl.end_year,
      })) || [],
    }
  } catch (error) {
    console.error('Service error:', error)
    return null
  }
}

export async function getScholarRelationships(scholarId: string) {
  try {
    const { data, error } = await supabase
      .from('relationships')
      .select(`
        *,
        scholar:scholars!relationships_scholar_id_fkey (*),
        related_scholar:scholars!relationships_related_scholar_id_fkey (*)
      `)
      .or(`scholar_id.eq.${scholarId},related_scholar_id.eq.${scholarId}`)

    if (error) {
      console.error('Error fetching relationships:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Relationships service error:', error)
    return []
  }
}

function getHighlightedFields(query: string, item: any): string[] {
  const fields: string[] = []
  const lowercaseQuery = query.toLowerCase()

  if (item.name_english?.toLowerCase().includes(lowercaseQuery)) {
    fields.push('name_english')
  }
  
  if (item.name_arabic?.toLowerCase().includes(lowercaseQuery)) {
    fields.push('name_arabic')
  }
  
  if (item.name_somali?.toLowerCase().includes(lowercaseQuery)) {
    fields.push('name_somali')
  }
  
  if (item.biography?.toLowerCase().includes(lowercaseQuery)) {
    fields.push('biography')
  }
  
  if (item.specializations?.some((spec: string) => 
    spec.toLowerCase().includes(lowercaseQuery)
  )) {
    fields.push('specializations')
  }

  if (item.major_works?.some((work: string) => 
    work.toLowerCase().includes(lowercaseQuery)
  )) {
    fields.push('major_works')
  }

  if (item.teaching_positions?.some((pos: string) => 
    pos.toLowerCase().includes(lowercaseQuery)
  )) {
    fields.push('teaching_positions')
  }

  if (item.scholarly_achievements?.some((achievement: string) => 
    achievement.toLowerCase().includes(lowercaseQuery)
  )) {
    fields.push('scholarly_achievements')
  }

  if (item.notable_contributions?.toLowerCase().includes(lowercaseQuery)) {
    fields.push('notable_contributions')
  }

  return fields
}

export async function getSuggestedSearches(): Promise<string[]> {
  // Return some popular search terms for the search bar suggestions
  return [
    'Ibrahim',
    'Ahmad', 
    'Muhammad',
    'Fatima',
    'Harar',
    'Zeila',
    'Mogadishu',
    'Fiqh',
    'Hadith',
    'Sufism',
    'Theology'
  ]
}