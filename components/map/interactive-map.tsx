'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

interface MapLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  country: string
  region: string
  scholar_count: number
  scholars: any[]
  time_periods: string[]
}

interface InteractiveMapProps {
  locations: MapLocation[]
  height?: number
  className?: string
}

// Custom marker component
function CustomMarker({ location, onClick }: { location: MapLocation; onClick: (location: MapLocation) => void }) {
  // Create custom icon based on scholar count
  const getMarkerSize = (count: number) => {
    if (count >= 10) return 'large'
    if (count >= 5) return 'medium'
    return 'small'
  }

  const getMarkerColor = (periods: string[]) => {
    // Color based on primary time period
    if (periods.some(p => p.includes('15th') || p.includes('16th'))) return '#dc2626' // red
    if (periods.some(p => p.includes('17th') || p.includes('18th'))) return '#2563eb' // blue
    if (periods.some(p => p.includes('19th') || p.includes('20th'))) return '#059669' // green
    return '#6b7280' // gray
  }

  const size = getMarkerSize(location.scholar_count)
  const color = getMarkerColor(location.time_periods)
  
  const markerSizes = {
    small: 20,
    medium: 30,
    large: 40
  }

  // Create a custom divIcon
  const customIcon = typeof window !== 'undefined' ? new (window as any).L.DivIcon({
    html: `
      <div style="
        width: ${markerSizes[size]}px;
        height: ${markerSizes[size]}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size === 'large' ? '14px' : size === 'medium' ? '12px' : '10px'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${location.scholar_count}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [markerSizes[size], markerSizes[size]],
    iconAnchor: [markerSizes[size] / 2, markerSizes[size] / 2]
  }) : null

  if (!customIcon) return null

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => onClick(location)
      }}
    />
  )
}

export function InteractiveMap({ locations, height = 500, className = '' }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    // Ensure Leaflet CSS is loaded
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      // Set up Leaflet
      const L = require('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      setMapReady(true)
    }
  }, [])

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location)
  }

  // Center map on Horn of Africa region
  const centerLat = 8.0
  const centerLng = 43.0
  const zoom = 6

  if (!mapReady) {
    return (
      <div 
        className={`bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center ${className}`}
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div style={{ height: `${height}px` }} className="rounded-lg overflow-hidden border">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations.map((location) => (
            <CustomMarker
              key={location.id}
              location={location}
              onClick={handleLocationClick}
            />
          ))}
        </MapContainer>
      </div>

      {/* Enhanced Location Details Modal */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 z-[1000] animate-in slide-in-from-right-2 duration-200">
          <Card className="w-96 max-h-[500px] overflow-hidden shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xl">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {selectedLocation.country} • {selectedLocation.region}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                    className="text-blue-100 hover:text-white hover:bg-blue-600 h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-700">
                      {selectedLocation.scholar_count}
                    </div>
                    <div className="text-sm font-medium text-blue-600">Scholars</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="text-3xl font-bold text-green-700">
                      {selectedLocation.time_periods.length}
                    </div>
                    <div className="text-sm font-medium text-green-600">Time Periods</div>
                  </div>
                </div>

                {/* Time Periods */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <div className="w-1 h-5 bg-blue-600 rounded-full mr-2"></div>
                    Historical Periods
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.time_periods.map((period) => (
                      <Badge 
                        key={period} 
                        className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 font-medium px-3 py-1"
                      >
                        {period}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Scholars */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <div className="w-1 h-5 bg-green-600 rounded-full mr-2"></div>
                    Notable Scholars
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedLocation.scholars.map((scholar) => (
                      <div key={scholar.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Link 
                              href={`/scholar/${scholar.id}`}
                              className="font-semibold text-blue-700 hover:text-blue-800 block"
                            >
                              {scholar.name_english}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full border">
                                {scholar.birth_year}–{scholar.death_year || 'present'}
                              </span>
                              {scholar.specializations && scholar.specializations.length > 0 && (
                                <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                                  {scholar.specializations[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link 
                            href={`/scholar/${scholar.id}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors ml-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href={`/search?location=${encodeURIComponent(selectedLocation.name)}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Explore All Scholars from {selectedLocation.name}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}