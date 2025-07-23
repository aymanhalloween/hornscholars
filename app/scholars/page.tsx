import { supabase } from '@/lib/supabase/client'
import { ScholarCard } from '@/components/scholar/scholar-card'
import { SearchBar } from '@/components/search/search-bar'
import Link from 'next/link'
import type { Scholar } from '@/lib/types'

async function getScholarsData() {
  try {
    // Fetch all scholars with their location data
    const { data: scholars, error } = await supabase
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
      .order('name_english', { ascending: true })

    if (error) throw error

    // Transform scholars to include location data
    const scholarsWithLocations: Scholar[] = (scholars || []).map(scholar => ({
      ...scholar,
      locations: scholar.scholar_locations?.map((sl: any) => ({
        ...sl.locations,
        location_type: sl.location_type,
        start_year: sl.start_year,
        end_year: sl.end_year,
      })) || [],
    }))

    // Calculate statistics
    const stats = {
      total: scholarsWithLocations.length,
      withDates: scholarsWithLocations.filter(s => s.birth_year || s.death_year).length,
      withBiographies: scholarsWithLocations.filter(s => s.biography).length,
      withSpecializations: scholarsWithLocations.filter(s => s.specializations && s.specializations.length > 0).length,
      centuries: Array.from(new Set(
        scholarsWithLocations
          .filter(s => s.birth_year)
          .map(s => Math.ceil(s.birth_year! / 100))
      )).length,
      locations: Array.from(new Set(
        scholarsWithLocations
          .filter(s => s.birth_location)
          .map(s => s.birth_location)
      )).length
    }

    return { scholars: scholarsWithLocations, stats }
  } catch (error) {
    console.error('Error fetching scholars:', error)
    return { 
      scholars: [], 
      stats: { total: 0, withDates: 0, withBiographies: 0, withSpecializations: 0, centuries: 0, locations: 0 } 
    }
  }
}

export default async function ScholarsPage() {
  const { scholars, stats } = await getScholarsData()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-4">
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Islamic Scholars Database
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Discover the remarkable scholars who shaped Islamic intellectual tradition 
                in the Horn of Africa. Browse all scholars or use advanced search to find specific individuals.
              </p>
            </div>

            {/* Search Integration */}
            <div className="max-w-2xl">
              <SearchBar placeholder="Search scholars by name, location, or expertise..." />
              <div className="mt-2">
                <Link 
                  href="/search" 
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Advanced Search & Filters →
                </Link>
              </div>
            </div>

            {/* Scholar Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Scholars</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-blue-600">{stats.withDates}</div>
                <div className="text-sm text-gray-500">With Dates</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-green-600">{stats.withBiographies}</div>
                <div className="text-sm text-gray-500">With Biographies</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-purple-600">{stats.withSpecializations}</div>
                <div className="text-sm text-gray-500">With Specializations</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-amber-600">{stats.centuries}</div>
                <div className="text-sm text-gray-500">Centuries</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-red-600">{stats.locations}</div>
                <div className="text-sm text-gray-500">Locations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              All Scholars ({scholars.length})
            </h2>
            <div className="text-sm text-gray-500">
              Sorted alphabetically by name
            </div>
          </div>
        </div>

        {scholars.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scholars found</h3>
              <p className="text-gray-600">
                No scholars are currently available in the database.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scholars.map((scholar) => (
              <ScholarCard
                key={scholar.id}
                scholar={scholar}
                highlighted_fields={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 