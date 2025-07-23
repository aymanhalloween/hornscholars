import { supabase } from '@/lib/supabase/client'

export interface LinkableEntity {
  id: string
  name: string
  type: 'scholar' | 'location' | 'work'
  url: string
  alternativeNames?: string[]
}

export interface EntityCache {
  scholars: LinkableEntity[]
  locations: LinkableEntity[]
  works: LinkableEntity[]
  lastUpdated: number
}

// Cache for entities to avoid repeated database calls
let entityCache: EntityCache | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetches all linkable entities from the database
 */
async function fetchLinkableEntities(): Promise<EntityCache> {
  const now = Date.now()
  
  // Return cached data if still valid
  if (entityCache && (now - entityCache.lastUpdated) < CACHE_DURATION) {
    return entityCache
  }

  try {
    // Fetch scholars
    const { data: scholarsData, error: scholarsError } = await supabase
      .from('scholars')
      .select('id, name_english, name_arabic, name_somali')

    if (scholarsError) throw scholarsError

    // Fetch locations
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('id, name, country, region')

    if (locationsError) throw locationsError

    // Fetch works
    const { data: worksData, error: worksError } = await supabase
      .from('works')
      .select('id, title_english, title_arabic, title_transliteration')

    if (worksError) throw worksError

    // Process scholars
    const scholars: LinkableEntity[] = (scholarsData || []).map(scholar => ({
      id: scholar.id,
      name: scholar.name_english,
      type: 'scholar' as const,
      url: `/scholar/${scholar.id}`,
      alternativeNames: [
        scholar.name_arabic,
        scholar.name_somali,
        // Add common variations
        scholar.name_english?.split(' ').slice(-1)[0], // Last name only
        scholar.name_english?.split(' ').slice(0, 2).join(' '), // First two names
      ].filter(Boolean)
    }))

    // Process locations
    const locations: LinkableEntity[] = (locationsData || []).map(location => ({
      id: location.id,
      name: location.name,
      type: 'location' as const,
      url: `/search?location=${encodeURIComponent(location.name)}`,
      alternativeNames: [
        location.country,
        location.region,
        // Add variations for major cities
        location.name?.includes(',') ? location.name.split(',')[0] : null,
      ].filter(Boolean)
    }))

    // Process works
    const works: LinkableEntity[] = (worksData || []).map(work => ({
      id: work.id,
      name: work.title_english || work.title_transliteration || work.title_arabic,
      type: 'work' as const,
      url: `/works/${work.id}`,
      alternativeNames: [
        work.title_arabic,
        work.title_transliteration,
        work.title_english,
      ].filter(Boolean)
    }))

    entityCache = {
      scholars,
      locations,
      works,
      lastUpdated: now
    }

    return entityCache
  } catch (error) {
    console.error('Error fetching linkable entities:', error)
    // Return empty cache on error
    return {
      scholars: [],
      locations: [],
      works: [],
      lastUpdated: now
    }
  }
}

/**
 * Creates a pattern for matching entity names in text
 */
function createMatchPattern(entities: LinkableEntity[]): RegExp {
  // Sort entities by name length (longest first) to match longer names first
  const sortedEntities = entities.sort((a, b) => b.name.length - a.name.length)
  
  const patterns = sortedEntities.flatMap(entity => {
    const names = [entity.name, ...(entity.alternativeNames || [])]
    return names.filter(name => name && name.length > 2) // Only include names longer than 2 characters
  })

  // Escape special regex characters and create pattern
  const escapedPatterns = patterns.map(name => 
    name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )

  // Create pattern that matches whole words only
  return new RegExp(`\\b(${escapedPatterns.join('|')})\\b`, 'gi')
}

/**
 * Finds entity by name (including alternative names)
 */
function findEntityByName(name: string, entities: LinkableEntity[]): LinkableEntity | null {
  return entities.find(entity => {
    const names = [entity.name, ...(entity.alternativeNames || [])]
    return names.some(n => n && n.toLowerCase() === name.toLowerCase())
  }) || null
}

/**
 * Converts plain text to HTML with auto-generated links
 */
export async function autoLinkText(text: string, options: {
  linkScholars?: boolean
  linkLocations?: boolean  
  linkWorks?: boolean
  excludeCurrentEntity?: string // ID of current entity to avoid self-linking
} = {}): Promise<string> {
  const {
    linkScholars = true,
    linkLocations = true,
    linkWorks = true,
    excludeCurrentEntity
  } = options

  if (!text || text.trim().length === 0) {
    return text
  }

  try {
    const cache = await fetchLinkableEntities()
    
    // Combine all entities based on options
    let allEntities: LinkableEntity[] = []
    if (linkScholars) allEntities.push(...cache.scholars)
    if (linkLocations) allEntities.push(...cache.locations)
    if (linkWorks) allEntities.push(...cache.works)

    // Exclude current entity if specified
    if (excludeCurrentEntity) {
      allEntities = allEntities.filter(entity => entity.id !== excludeCurrentEntity)
    }

    if (allEntities.length === 0) {
      return text
    }

    const pattern = createMatchPattern(allEntities)
    
    // Keep track of already processed ranges to avoid nested links
    const processedRanges: Array<[number, number]> = []
    
    // Replace matches with links
    let result = text.replace(pattern, (match, p1, offset) => {
      // Check if this match overlaps with already processed ranges
      const matchEnd = offset + match.length
      const overlaps = processedRanges.some(([start, end]) => 
        (offset >= start && offset < end) || (matchEnd > start && matchEnd <= end)
      )
      
      if (overlaps) {
        return match // Don't process overlapping matches
      }

      const entity = findEntityByName(match, allEntities)
      if (!entity) {
        return match
      }

      // Mark this range as processed
      processedRanges.push([offset, matchEnd])

      // Create appropriate link based on entity type
      const className = `auto-link auto-link-${entity.type}`
      const title = `View ${entity.type}: ${entity.name}`
      
      return `<a href="${entity.url}" class="${className}" title="${title}">${match}</a>`
    })

    return result
  } catch (error) {
    console.error('Error in autoLinkText:', error)
    return text // Return original text on error
  }
}

// React component interface (implemented in separate file)

/**
 * Utility to extract potential entity names from text for search suggestions
 */
export async function extractPotentialEntities(text: string): Promise<{
  scholars: string[]
  locations: string[]
  works: string[]
}> {
  const cache = await fetchLinkableEntities()
  
  const scholarPattern = createMatchPattern(cache.scholars)
  const locationPattern = createMatchPattern(cache.locations)
  const workPattern = createMatchPattern(cache.works)
  
  const scholars = Array.from(text.matchAll(scholarPattern), m => m[0])
  const locations = Array.from(text.matchAll(locationPattern), m => m[0])
  const works = Array.from(text.matchAll(workPattern), m => m[0])
  
  return {
    scholars: Array.from(new Set(scholars)), // Remove duplicates
    locations: Array.from(new Set(locations)),
    works: Array.from(new Set(works))
  }
}

/**
 * Clear the entity cache (useful for testing or forced refresh)
 */
export function clearEntityCache(): void {
  entityCache = null
}