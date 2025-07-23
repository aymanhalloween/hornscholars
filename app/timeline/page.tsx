import { supabase } from '@/lib/supabase/client'
import { TimelineView } from '@/components/timeline/timeline-view'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Scholar } from '@/lib/types'

interface TimelineScholar extends Scholar {
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

async function getTimelineData() {
  try {
    // Fetch scholars with dates for timeline
    const { data: scholars, error } = await supabase
      .from('scholars')
      .select('*')
      .not('birth_year', 'is', null)
      .order('birth_year', { ascending: true })

    if (error) throw error

    // Process scholars by century
    const centuryMap = new Map<number, TimelineScholar[]>()
    const timelineScholars: TimelineScholar[] = (scholars || []).map(scholar => {
      const birthYear = scholar.birth_year || 1400
      const century = Math.floor(birthYear / 100) + 1
      
      // Determine period label
      let periodLabel = `${century}th Century`
      if (century === 15) periodLabel = '15th Century - Early Period'
      if (century === 16) periodLabel = '16th Century - Classical Period'  
      if (century === 17) periodLabel = '17th Century - Expansion Period'
      if (century === 18) periodLabel = '18th Century - Consolidation'
      if (century === 19) periodLabel = '19th Century - Reform Period'
      if (century === 20) periodLabel = '20th Century - Modern Era'

      const timelineScholar: TimelineScholar = {
        ...scholar,
        century,
        period_label: periodLabel
      }

      if (!centuryMap.has(century)) {
        centuryMap.set(century, [])
      }
      centuryMap.get(century)?.push(timelineScholar)

      return timelineScholar
    })

    // Create century data with historical context
    const centuryData: CenturyData[] = Array.from(centuryMap.entries())
      .map(([century, scholars]) => {
        const period = scholars[0]?.period_label || `${century}th Century`
        
        // Add historical context based on century
        let majorEvents: string[] = []
        let intellectualMovements: string[] = []
        
        switch (century) {
          case 15:
            majorEvents = ['Adal Sultanate establishment', 'Portuguese arrival in Horn', 'Zeila as major port']
            intellectualMovements = ['Early Sufi orders', 'Qadiriyya introduction', 'Legal scholarship foundations']
            break
          case 16:
            majorEvents = ['Adal-Ethiopian wars', 'Ottoman influence', 'Ahmad Gurey campaigns'] 
            intellectualMovements = ['Mystical poetry flourishing', 'Hadith scholarship', 'Shafi\'i jurisprudence']
            break
          case 17:
            majorEvents = ['Sultanate of Harar', 'Trade route expansion', 'Scholarly migrations']
            intellectualMovements = ['Sufi brotherhoods growth', 'Arabic literary tradition', 'Theological debates']
            break
          case 18:
            majorEvents = ['Emirate of Harar peak', 'Scholarly exchanges with Hijaz', 'Educational institutions']
            intellectualMovements = ['Reformist tendencies', 'Hadith criticism', 'Legal codification']
            break
          case 19:
            majorEvents = ['European colonization', 'Egyptian occupation', 'Modernization pressures']
            intellectualMovements = ['Islamic modernism', 'Educational reform', 'Anti-colonial scholarship']
            break
          case 20:
            majorEvents = ['Independence movements', 'Modern state formation', 'Diaspora communities']
            intellectualMovements = ['Contemporary Islamic thought', 'Academic institutions', 'Global connections']
            break
        }

        return {
          century,
          period,
          scholars: scholars.sort((a, b) => (a.birth_year || 0) - (b.birth_year || 0)),
          major_events: majorEvents,
          intellectual_movements: intellectualMovements
        }
      })
      .sort((a, b) => a.century - b.century)

    // Calculate timeline statistics
    const totalScholars = timelineScholars.length
    const centurySpan = centuryData.length
    const peakCentury = centuryData.reduce((max, current) => 
      current.scholars.length > max.scholars.length ? current : max
    )

    return {
      scholars: timelineScholars,
      centuryData,
      stats: {
        totalScholars,
        centurySpan,
        peakCentury: peakCentury.period,
        peakCount: peakCentury.scholars.length,
        earliestYear: Math.min(...timelineScholars.map(s => s.birth_year || 9999)),
        latestYear: Math.max(...timelineScholars.map(s => s.birth_year || 0))
      }
    }
  } catch (error) {
    console.error('Error fetching timeline data:', error)
    return {
      scholars: [],
      centuryData: [],
      stats: {
        totalScholars: 0,
        centurySpan: 0,
        peakCentury: 'Unknown',
        peakCount: 0,
        earliestYear: 0,
        latestYear: 0
      }
    }
  }
}

export default async function TimelinePage() {
  const { scholars, centuryData, stats } = await getTimelineData()

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
                Chronological Timeline
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Explore the intellectual heritage of Horn of Africa scholars across centuries. 
                Trace the evolution of Islamic scholarship from the 15th century to modern times.
              </p>
            </div>

            {/* Timeline Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.totalScholars}</div>
                <div className="text-sm text-gray-500">Total Scholars</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.centurySpan}</div>
                <div className="text-sm text-gray-500">Centuries Covered</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.earliestYear}</div>
                <div className="text-sm text-gray-500">Earliest Record</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.latestYear}</div>
                <div className="text-sm text-gray-500">Latest Record</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-xl font-semibold text-gray-900">{stats.peakCount}</div>
                <div className="text-sm text-gray-500">Peak Century Scholars</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Timeline Visualization */}
          <div className="lg:col-span-3">
            <TimelineView 
              centuryData={centuryData}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Century Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Periods Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {centuryData.map((period) => (
                    <div key={period.century} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {period.century}th Century
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {period.scholars.length} scholars
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(period.scholars.length / stats.peakCount) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Major Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Major Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    'Fiqh (Jurisprudence)',
                    'Hadith Studies', 
                    'Quranic Exegesis',
                    'Sufism',
                    'Arabic Literature',
                    'Theology (Kalam)',
                    'Logic & Philosophy'
                  ].map((specialization) => {
                    const count = scholars.filter(s => 
                      s.specializations?.some(spec => 
                        spec.toLowerCase().includes(specialization.toLowerCase().split(' ')[0])
                      )
                    ).length
                    
                    return (
                      <div key={specialization} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{specialization}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Centers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Major Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    'Harar',
                    'Zeila', 
                    'Mogadishu',
                    'Berbera',
                    'Jigjiga',
                    'Mecca',
                    'Cairo'
                  ].map((location) => {
                    const count = scholars.filter(s => 
                      s.birth_location?.includes(location) || 
                      s.death_location?.includes(location)
                    ).length
                    
                    return count > 0 ? (
                      <div key={location} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{location}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• <strong>Click</strong> scholars to view detailed profiles</p>
                <p>• <strong>Scroll</strong> vertically to explore centuries</p>
                <p>• <strong>Hover</strong> over events for more context</p>
                <p>• <strong>Filter</strong> by specialization or location</p>
                <p>• Circle size indicates scholarly influence</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}