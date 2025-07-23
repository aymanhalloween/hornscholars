import { supabase } from '@/lib/supabase/client'
import { InteractiveMap } from '@/components/map/interactive-map'
import { MapFilters } from '@/components/map/map-filters'
import { MapLegend } from '@/components/map/map-legend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Scholar, Location as ScholarLocation } from '@/lib/types'

interface MapScholar extends Scholar {
  primary_location?: {
    name: string
    latitude: number
    longitude: number
    country: string
    region: string
  }
}

interface LocationData {
  id: string
  name: string
  latitude: number
  longitude: number
  country: string
  region: string
  scholar_count: number
  scholars: MapScholar[]
  time_periods: string[]
}

async function getMapData() {
  try {
    // Fetch scholars with their locations
    const { data: scholars, error: scholarsError } = await supabase
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
      .not('birth_location', 'is', null)

    if (scholarsError) throw scholarsError

    // Fetch all locations
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('*')

    if (locationsError) throw locationsError

    // Process data for mapping
    const locationsMap = {} as Record<string, LocationData>

    // Process each scholar
    (scholars || []).forEach((scholar: any) => {
      // Determine primary location (birth location or first documented location)
      let primaryLocation = null
      
      if (scholar.scholar_locations && scholar.scholar_locations.length > 0) {
        // Use first location with coordinates
        const locationWithCoords = scholar.scholar_locations.find((sl: any) => 
          sl.locations.latitude && sl.locations.longitude
        )
        if (locationWithCoords) {
          primaryLocation = locationWithCoords.locations
        }
      }

      // If no precise location, try to match birth_location to existing locations
      if (!primaryLocation && scholar.birth_location) {
        const matchedLocation = (locations || []).find((loc: any) => 
          scholar.birth_location.toLowerCase().includes(loc.name.toLowerCase()) ||
          loc.name.toLowerCase().includes(scholar.birth_location.toLowerCase())
        )
        if (matchedLocation) {
          primaryLocation = matchedLocation
        }
      }

      if (primaryLocation) {
        const locationKey = `${primaryLocation.latitude},${primaryLocation.longitude}`
        
        if (!locationsMap[locationKey]) {
          locationsMap[locationKey] = {
            id: primaryLocation.id,
            name: primaryLocation.name,
            latitude: primaryLocation.latitude,
            longitude: primaryLocation.longitude,
            country: primaryLocation.country || 'Unknown',
            region: primaryLocation.region || 'Unknown',
            scholar_count: 0,
            scholars: [],
            time_periods: []
          }
        }

        const locationData = locationsMap[locationKey]
        locationData.scholar_count++
        locationData.scholars.push({
          ...scholar,
          primary_location: primaryLocation
        })

        // Add time period
        if (scholar.birth_year) {
          const century = Math.floor(scholar.birth_year / 100) + 1
          const period = `${century}th Century`
          if (!locationData.time_periods.includes(period)) {
            locationData.time_periods.push(period)
          }
        }
      }
    })

    const mapLocations = Object.values(locationsMap)
      .filter(loc => loc.latitude && loc.longitude)
      .sort((a, b) => b.scholar_count - a.scholar_count)

    // Calculate statistics
    const totalScholars = mapLocations.reduce((sum, loc) => sum + loc.scholar_count, 0)
    const totalLocations = mapLocations.length
    const majorCenters = mapLocations.filter(loc => loc.scholar_count >= 3)
    const countriesRepresented = Array.from(new Set(mapLocations.map(loc => loc.country))).length

    return {
      locations: mapLocations,
      stats: {
        totalScholars,
        totalLocations,
        majorCenters: majorCenters.length,
        countriesRepresented,
        timeSpan: {
          earliest: Math.min(...(scholars || []).map((s: any) => s.birth_year || 9999)),
          latest: Math.max(...(scholars || []).map((s: any) => s.death_year || 0))
        }
      }
    }
  } catch (error) {
    console.error('Error fetching map data:', error)
    return {
      locations: [],
      stats: {
        totalScholars: 0,
        totalLocations: 0,
        majorCenters: 0,
        countriesRepresented: 0,
        timeSpan: { earliest: 0, latest: 0 }
      }
    }
  }
}

export default async function MapPage() {
  const { locations, stats } = await getMapData()

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
              ← Back to Search
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Geographic Map
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Explore the geographical distribution of Islamic scholarship across the Horn of Africa. 
                Discover centers of learning, migration patterns, and the spread of knowledge through time and space.
              </p>
            </div>

            {/* Map Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.totalScholars}</div>
                <div className="text-sm text-gray-500">Mapped Scholars</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.totalLocations}</div>
                <div className="text-sm text-gray-500">Geographic Locations</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.majorCenters}</div>
                <div className="text-sm text-gray-500">Major Centers</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.countriesRepresented}</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xl font-semibold text-gray-900">
                  {stats.timeSpan.earliest}–{stats.timeSpan.latest}
                </div>
                <div className="text-sm text-gray-500">Time Span</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Interactive Geographic Map</span>
                  <Badge variant="secondary" className="text-xs">
                    {locations.length} locations
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <InteractiveMap 
                  locations={locations}
                  height={600}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Legend */}
            <MapLegend />

            {/* Map Filters */}
            <MapFilters />

            {/* Major Centers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Major Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locations.slice(0, 8).map((location) => (
                    <div key={location.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-gray-900">
                          {location.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {location.scholar_count} scholars
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {location.country} • {location.time_periods.join(', ')}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(100, (location.scholar_count / Math.max(...locations.map(l => l.scholar_count))) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    locations.reduce((acc, loc) => {
                      const region = loc.country || 'Unknown'
                      acc[region] = (acc[region] || 0) + loc.scholar_count
                      return acc
                    }, {} as Record<string, number>)
                  )
                    .sort(([,a], [,b]) => b - a)
                    .map(([region, count]) => (
                      <div key={region} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{region}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• <strong>Click</strong> markers to view scholars from that location</p>
                <p>• <strong>Zoom</strong> and pan to explore different regions</p>
                <p>• <strong>Hover</strong> over markers for quick information</p>
                <p>• Marker size indicates number of scholars</p>
                <p>• Colors represent different time periods</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}