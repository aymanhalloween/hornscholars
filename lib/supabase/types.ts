export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      scholars: {
        Row: {
          id: string
          name_arabic: string
          name_english: string
          name_somali: string | null
          birth_year: number | null
          death_year: number | null
          biography: string | null
          specializations: string[] | null
          created_at: string
          updated_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          name_arabic: string
          name_english: string
          name_somali?: string | null
          birth_year?: number | null
          death_year?: number | null
          biography?: string | null
          specializations?: string[] | null
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          name_arabic?: string
          name_english?: string
          name_somali?: string | null
          birth_year?: number | null
          death_year?: number | null
          biography?: string | null
          specializations?: string[] | null
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: string
          name: string
          latitude: number | null
          longitude: number | null
          country: string | null
          region: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          latitude?: number | null
          longitude?: number | null
          country?: string | null
          region?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number | null
          longitude?: number | null
          country?: string | null
          region?: string | null
          created_at?: string
        }
        Relationships: []
      }
      relationships: {
        Row: {
          id: string
          scholar_id: string
          related_scholar_id: string
          relationship_type: 'teacher' | 'student' | 'contemporary' | 'location_based'
          created_at: string
        }
        Insert: {
          id?: string
          scholar_id: string
          related_scholar_id: string
          relationship_type: 'teacher' | 'student' | 'contemporary' | 'location_based'
          created_at?: string
        }
        Update: {
          id?: string
          scholar_id?: string
          related_scholar_id?: string
          relationship_type?: 'teacher' | 'student' | 'contemporary' | 'location_based'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "relationships_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_related_scholar_id_fkey"
            columns: ["related_scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          }
        ]
      }
      scholar_locations: {
        Row: {
          id: string
          scholar_id: string
          location_id: string
          location_type: 'birth' | 'study' | 'residence' | 'death'
          start_year: number | null
          end_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          scholar_id: string
          location_id: string
          location_type: 'birth' | 'study' | 'residence' | 'death'
          start_year?: number | null
          end_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          scholar_id?: string
          location_id?: string
          location_type?: 'birth' | 'study' | 'residence' | 'death'
          start_year?: number | null
          end_year?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scholar_locations_scholar_id_fkey"
            columns: ["scholar_id"]
            isOneToOne: false
            referencedRelation: "scholars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholar_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
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
          biography: string | null
          specializations: string[] | null
          relevance_score: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}