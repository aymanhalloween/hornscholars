'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Calendar, ExternalLink } from 'lucide-react'
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
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
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
    >
      <Popup>
        <div className="w-64 p-2">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">{location.name}</h3>
              <p className="text-sm text-gray-600">{location.country}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span>{location.scholar_count} scholars</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-green-600" />
                <span>{location.time_periods.length} periods</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Time Periods:</p>
              <div className="flex flex-wrap gap-1">
                {location.time_periods.slice(0, 3).map((period) => (
                  <Badge key={period} variant="outline" className="text-xs">
                    {period}
                  </Badge>
                ))}
                {location.time_periods.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{location.time_periods.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">Notable Scholars:</p>
              <div className="space-y-1">
                {location.scholars.slice(0, 3).map((scholar) => (
                  <div key={scholar.id} className="text-xs">
                    <Link 
                      href={`/scholar/${scholar.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {scholar.name_english}
                    </Link>
                    <span className="text-gray-500 ml-1">
                      {scholar.birth_year && `(${scholar.birth_year})`}
                    </span>
                  </div>
                ))}
                {location.scholars.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{location.scholars.length - 3} more scholars
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
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

      {/* Location Details Modal */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 z-[1000]">
          <Card className="w-80 max-h-96 overflow-y-auto shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedLocation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedLocation.country} • {selectedLocation.region}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-semibold text-blue-600">
                      {selectedLocation.scholar_count}
                    </div>
                    <div className="text-xs text-gray-600">Scholars</div>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-semibold text-green-600">
                      {selectedLocation.time_periods.length}
                    </div>
                    <div className="text-xs text-gray-600">Periods</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Time Periods</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.time_periods.map((period) => (
                      <Badge key={period} variant="secondary" className="text-xs">
                        {period}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Scholars</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedLocation.scholars.map((scholar) => (
                      <div key={scholar.id} className="flex items-center justify-between">
                        <div>
                          <Link 
                            href={`/scholar/${scholar.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            {scholar.name_english}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {scholar.birth_year}–{scholar.death_year || '?'}
                          </p>
                        </div>
                        <Link 
                          href={`/scholar/${scholar.id}`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Link
                    href={`/search?location=${encodeURIComponent(selectedLocation.name)}`}
                    className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    View All Scholars from {selectedLocation.name}
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