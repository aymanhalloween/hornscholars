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
    const results: SearchResult[] = data.map((item) => ({
      scholar: {
        id: item.id,
        name_arabic: item.name_arabic,
        name_english: item.name_english,
        name_somali: item.name_somali,
        birth_year: item.birth_year,
        death_year: item.death_year,
        biography: item.biography,
        specializations: item.specializations || [],
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
      biography: data.biography,
      specializations: data.specializations || [],
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