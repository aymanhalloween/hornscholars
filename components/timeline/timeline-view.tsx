'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, BookOpen, Users } from 'lucide-react'

interface TimelineScholar {
  id: string
  name_english: string
  name_arabic: string | null
  birth_year: number | null
  death_year: number | null
  birth_location: string | null
  death_location: string | null
  specializations: string[] | null
  century: number
  period_label: string
}

interface CenturyData {
  century: number
  period: string
  scholars: TimelineScholar[]
  major_events: string[]
  intellectual_movements: string[]
}

interface TimelineViewProps {
  centuryData: CenturyData[]
  className?: string
}

export function TimelineView({ 
  centuryData,
  className = '' 
}: TimelineViewProps) {
  const [selectedCentury, setSelectedCentury] = React.useState<number | null>(null)
  const [selectedMovement, setSelectedMovement] = React.useState<string | null>(null)

  const router = useRouter()
  
  const handleScholarClick = (scholar: TimelineScholar) => {
    router.push(`/scholar/${scholar.id}`)
  }

  const getScholarsByPeriod = (scholars: TimelineScholar[]) => {
    // Group scholars by decades within century for better visualization
    const decades = new Map<number, TimelineScholar[]>()
    
    scholars.forEach(scholar => {
      const decade = Math.floor((scholar.birth_year || 1400) / 10) * 10
      if (!decades.has(decade)) {
        decades.set(decade, [])
      }
      decades.get(decade)?.push(scholar)
    })

    return Array.from(decades.entries())
      .sort(([a], [b]) => a - b)
      .map(([decade, scholarList]) => ({
        decade,
        scholars: scholarList.sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0))
      }))
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Six Centuries of Islamic Scholarship
        </h2>
        <p className="text-gray-600">
          Scroll through time to explore the intellectual heritage of the Horn of Africa
        </p>
      </div>

      {/* Century Timeline */}
      <div className="relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-0.5 w-1 bg-gray-300 h-full" />
        
        {centuryData.map((period, index) => {
          const isSelected = selectedCentury === period.century
          const isLeft = index % 2 === 0
          const decadeGroups = getScholarsByPeriod(period.scholars)
          
          return (
            <div key={period.century} className="relative mb-16">
              {/* Century Marker */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div 
                  className={`w-6 h-6 rounded-full border-4 border-white shadow-lg cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  onClick={() => setSelectedCentury(isSelected ? null : period.century)}
                />
              </div>

              {/* Period Content */}
              <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'} mb-8`}>
                <Card 
                  className={`w-full max-w-2xl ${isLeft ? 'mr-12' : 'ml-12'} ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{period.period}</CardTitle>
                      <Badge variant="outline" className="text-sm">
                        {period.scholars.length} scholars
                      </Badge>
                    </div>
                    
                    {/* Period Statistics */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {Math.min(...period.scholars.map(s => s.birth_year || 9999))}–
                          {Math.max(...period.scholars.map(s => s.death_year || 0))}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{period.scholars.length} scholars</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Historical Context */}
                    <div className="mb-6 space-y-3">
                      {period.major_events.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Major Events
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {period.major_events.map((event, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {period.intellectual_movements.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            Intellectual Movements
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {period.intellectual_movements.map((movement, i) => (
                              <Badge 
                                key={i} 
                                variant={selectedMovement === movement ? "default" : "outline"}
                                className="text-xs cursor-pointer"
                                onClick={() => setSelectedMovement(
                                  selectedMovement === movement ? null : movement
                                )}
                              >
                                {movement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scholars by Decade */}
                    {decadeGroups.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Notable Scholars</h4>
                        {decadeGroups.map(({ decade, scholars }) => (
                          <div key={decade} className="space-y-2">
                            <div className="text-sm font-medium text-gray-700">
                              {decade}s
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {scholars.slice(0, 6).map((scholar) => (
                                <div
                                  key={scholar.id}
                                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                  onClick={() => handleScholarClick(scholar)}
                                >
                                  <div className="space-y-1">
                                    <div className="font-medium text-sm text-gray-900">
                                      {scholar.name_english}
                                    </div>
                                    {scholar.name_arabic && (
                                      <div className="text-xs text-arabic text-gray-600 font-arabic">
                                        {scholar.name_arabic}
                                      </div>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span>
                                        {scholar.birth_year}
                                        {scholar.birth_year && scholar.death_year && '–'}
                                        {scholar.death_year}
                                      </span>
                                      {scholar.birth_location && (
                                        <span className="flex items-center gap-1">
                                          <MapPin className="w-3 h-3" />
                                          {scholar.birth_location.split(',')[0]}
                                        </span>
                                      )}
                                    </div>
                                    {scholar.specializations && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {scholar.specializations.slice(0, 2).map((spec, i) => (
                                          <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                                            {spec}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {scholars.length > 6 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-xs text-blue-600 hover:text-blue-700"
                                onClick={() => setSelectedCentury(period.century)}
                              >
                                View all {scholars.length} scholars from {decade}s
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded Century View */}
      {selectedCentury && (
        <Card className="mt-8 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {centuryData.find(c => c.century === selectedCentury)?.period} - Detailed View
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCentury(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {centuryData
                .find(c => c.century === selectedCentury)
                ?.scholars.map((scholar) => (
                  <div
                    key={scholar.id}
                    className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => handleScholarClick(scholar)}
                  >
                    <div className="space-y-2">
                      <div className="font-medium text-gray-900">
                        {scholar.name_english}
                      </div>
                      {scholar.name_arabic && (
                        <div className="text-sm text-arabic text-gray-600 font-arabic">
                          {scholar.name_arabic}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {scholar.birth_year}–{scholar.death_year || 'unknown'}
                        {scholar.birth_location && ` • ${scholar.birth_location}`}
                      </div>
                      {scholar.specializations && (
                        <div className="flex flex-wrap gap-1">
                          {scholar.specializations.map((spec, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}