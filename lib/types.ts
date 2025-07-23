export interface Scholar {
  id: string
  name_arabic: string
  name_english: string
  name_somali: string | null
  birth_year: number | null
  death_year: number | null
  birth_location: string | null
  death_location: string | null
  biography: string | null
  locations?: Location[]
  specializations: string[] | null
  major_works: string[] | null
  teaching_positions: string[] | null
  scholarly_achievements: string[] | null
  students: string[] | null
  notable_contributions: string | null
  intellectual_lineage: string | null
  manuscripts_authored: number | null
  teaching_years_start: number | null
  teaching_years_end: number | null
  created_at: string
  updated_at: string
  search_vector?: unknown
}

export interface Location {
  id: string
  name: string
  latitude?: number
  longitude?: number
  country?: string
  region?: string
  created_at: string
}

export interface ScholarLocation {
  id: string
  scholar_id: string
  location_id: string
  location_type: 'birth' | 'death' | 'study' | 'teaching' | 'residence' | 'travel'
  start_year: number | null
  end_year: number | null
  description: string | null
  created_at: string
  scholar?: Scholar
  location?: Location
}

export interface Relationship {
  id: string
  scholar_id: string
  related_scholar_id: string
  relationship_type: 'teacher' | 'student' | 'contemporary' | 'location_based'
  created_at: string
  scholar?: Scholar
  related_scholar?: Scholar
}

export interface Work {
  id: string
  title_arabic: string
  title_english: string | null
  title_transliteration: string | null
  composition_year: number | null
  composition_location: string | null
  subject_area: string[] | null
  manuscript_status: 'published' | 'manuscript' | 'lost' | 'unknown'
  description: string | null
  notes: string | null
  pages: number | null
  language: string
  genre: string | null
  extant_copies: number
  library_locations: string[] | null
  publication_details: string | null
  created_at: string
  updated_at: string
  search_vector?: unknown
}

export interface WorkAuthor {
  id: string
  work_id: string
  scholar_id: string
  author_role: 'author' | 'co-author' | 'translator' | 'commentator' | 'editor'
  attribution_certainty: 'certain' | 'probable' | 'disputed' | 'false'
  created_at: string
  work?: Work
  scholar?: Scholar
}

export interface WorkRelationship {
  id: string
  source_work_id: string
  target_work_id: string
  relationship_type: 'commentary' | 'response' | 'refutation' | 'summary' | 'translation' | 'quotation'
  description: string | null
  created_at: string
  source_work?: Work
  target_work?: Work
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
  fx?: number | null
  fy?: number | null
}

export type ScholarNetworkLink = {
  source: string
  target: string
  relationship_type: string
  strength: number
}

export type D3ScholarNetworkLink = {
  source: string | ScholarNetworkNode
  target: string | ScholarNetworkNode
  relationship_type: string
  strength: number
}

export interface TimelineScholar extends Scholar {
  century: number
  period_label: string
}

export interface CenturyData {
  century: number
  period: string
  scholars: TimelineScholar[]
  major_events: string[]
  intellectual_movements: string[]
}

// Database table definitions for better type safety
export interface Database {
  public: {
    Tables: {
      scholars: {
        Row: Scholar
        Insert: Omit<Scholar, 'id' | 'created_at' | 'updated_at' | 'search_vector'>
        Update: Partial<Omit<Scholar, 'id' | 'created_at' | 'search_vector'>>
      }
      locations: {
        Row: Location
        Insert: Omit<Location, 'id' | 'created_at'>
        Update: Partial<Omit<Location, 'id' | 'created_at'>>
      }
      scholar_locations: {
        Row: ScholarLocation
        Insert: Omit<ScholarLocation, 'id' | 'created_at'>
        Update: Partial<Omit<ScholarLocation, 'id' | 'created_at'>>
      }
      relationships: {
        Row: Relationship
        Insert: Omit<Relationship, 'id' | 'created_at'>
        Update: Partial<Omit<Relationship, 'id' | 'created_at'>>
      }
      works: {
        Row: Work
        Insert: Omit<Work, 'id' | 'created_at' | 'updated_at' | 'search_vector'>
        Update: Partial<Omit<Work, 'id' | 'created_at' | 'search_vector'>>
      }
      work_authors: {
        Row: WorkAuthor
        Insert: Omit<WorkAuthor, 'id' | 'created_at'>
        Update: Partial<Omit<WorkAuthor, 'id' | 'created_at'>>
      }
      work_relationships: {
        Row: WorkRelationship
        Insert: Omit<WorkRelationship, 'id' | 'created_at'>
        Update: Partial<Omit<WorkRelationship, 'id' | 'created_at'>>
      }
    }
    Views: {}
    Functions: {
      search_scholars: {
        Args: {
          search_query: string
          limit_count?: number
        }
        Returns: {
          id: string
          name_arabic: string
          name_english: string
          name_somali: string | null
          birth_year: number | null
          death_year: number | null
          birth_location: string | null
          death_location: string | null
          biography: string | null
          specializations: string[] | null
          major_works: string[] | null
          teaching_positions: string[] | null
          scholarly_achievements: string[] | null
          notable_contributions: string | null
          relevance_score: number
        }[]
      }
    }
    Enums: {}
  }
}