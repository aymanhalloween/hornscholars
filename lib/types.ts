export interface Scholar {
  id: string
  name_arabic: string
  name_english: string
  name_somali: string | null
  birth_year: number | null
  death_year: number | null
  biography: string | null
  locations?: Location[]
  specializations: string[] | null
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  name: string
  latitude?: number
  longitude?: number
  country?: string
  region?: string
}

export interface Relationship {
  id: string
  scholar_id: string
  related_scholar_id: string
  relationship_type: 'teacher' | 'student' | 'contemporary' | 'location_based'
  scholar?: Scholar
  related_scholar?: Scholar
}

export interface SearchResult {
  scholar: Scholar
  relevance_score: number
  highlighted_fields: string[]
}

export interface SearchFilters {
  location?: string
  century?: number
  school_of_thought?: string
  specialization?: string
}

export type ScholarNetworkNode = {
  id: string
  name: string
  type: 'scholar'
  centrality_score?: number
  x?: number
  y?: number
}

export type ScholarNetworkLink = {
  source: string
  target: string
  relationship_type: string
  strength: number
}