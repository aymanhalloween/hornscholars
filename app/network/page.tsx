import { getScholarRelationships } from '@/lib/services/search'
import { supabase } from '@/lib/supabase/client'
import { ScholarNetwork } from '@/components/network/scholar-network'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { ScholarNetworkNode, ScholarNetworkLink } from '@/lib/types'

async function getNetworkData() {
  try {
    // Fetch all scholars with their basic info
    const { data: scholars, error: scholarsError } = await supabase
      .from('scholars')
      .select('id, name_english, name_arabic, birth_year, death_year, specializations')

    if (scholarsError) throw scholarsError

    // Fetch all relationships
    const { data: relationships, error: relationshipsError } = await supabase
      .from('relationships')
      .select(`
        id,
        scholar_id,
        related_scholar_id,
        relationship_type,
        scholar:scholars!relationships_scholar_id_fkey(id, name_english),
        related_scholar:scholars!relationships_related_scholar_id_fkey(id, name_english)
      `)

    if (relationshipsError) throw relationshipsError

    // Calculate centrality scores (simple degree centrality)
    const connectionCounts = new Map<string, number>()
    relationships?.forEach(rel => {
      const scholarId = rel.scholar_id
      const relatedId = rel.related_scholar_id
      connectionCounts.set(scholarId, (connectionCounts.get(scholarId) || 0) + 1)
      connectionCounts.set(relatedId, (connectionCounts.get(relatedId) || 0) + 1)
    })

    const maxConnections = Math.max(...Array.from(connectionCounts.values()), 1)

    // Transform scholars to network nodes
    const networkNodes: ScholarNetworkNode[] = (scholars || []).map(scholar => ({
      id: scholar.id,
      name: scholar.name_english,
      type: 'scholar' as const,
      centrality_score: (connectionCounts.get(scholar.id) || 0) / maxConnections
    }))

    // Transform relationships to network links
    const networkLinks: ScholarNetworkLink[] = (relationships || []).map(rel => ({
      source: rel.scholar_id,
      target: rel.related_scholar_id,
      relationship_type: rel.relationship_type,
      strength: rel.relationship_type === 'teacher' ? 0.9 : 
                rel.relationship_type === 'student' ? 0.9 :
                rel.relationship_type === 'contemporary' ? 0.6 : 0.4
    }))

    return {
      scholars: networkNodes,
      relationships: networkLinks,
      rawScholars: scholars || [],
      rawRelationships: relationships || []
    }
  } catch (error) {
    console.error('Error fetching network data:', error)
    return {
      scholars: [],
      relationships: [],
      rawScholars: [],
      rawRelationships: []
    }
  }
}

export default async function NetworkPage() {
  const { scholars, relationships, rawScholars, rawRelationships } = await getNetworkData()

  // Calculate network statistics
  const totalScholars = scholars.length
  const totalConnections = relationships.length
  const averageConnections = totalScholars > 0 ? totalConnections / totalScholars : 0

  // Find most connected scholars
  const connectionCounts = new Map<string, number>()
  relationships.forEach(rel => {
    connectionCounts.set(rel.source, (connectionCounts.get(rel.source) || 0) + 1)
    connectionCounts.set(rel.target, (connectionCounts.get(rel.target) || 0) + 1)
  })

  const topScholars = rawScholars
    .map(scholar => ({
      ...scholar,
      connections: connectionCounts.get(scholar.id) || 0
    }))
    .sort((a, b) => b.connections - a.connections)
    .slice(0, 10)

  // Group relationships by type
  const relationshipTypes = relationships.reduce((acc, rel) => {
    acc[rel.relationship_type] = (acc[rel.relationship_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

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
                Scholar Network
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Explore the intellectual connections between scholars from the Horn of Africa. 
                Discover teacher-student relationships, contemporary connections, and centers of learning.
              </p>
            </div>

            {/* Network Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{totalScholars}</div>
                <div className="text-sm text-gray-500">Total Scholars</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{totalConnections}</div>
                <div className="text-sm text-gray-500">Connections</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {averageConnections.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">Avg. Connections</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">
                  {Object.keys(relationshipTypes).length}
                </div>
                <div className="text-sm text-gray-500">Relationship Types</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Network Visualization */}
          <div className="lg:col-span-3">
            <ScholarNetwork
              scholars={scholars}
              relationships={relationships}
              height={700}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Relationship Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Relationship Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(relationshipTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            type === 'teacher' ? 'bg-blue-600' :
                            type === 'student' ? 'bg-green-600' :
                            type === 'contemporary' ? 'bg-purple-600' : 'bg-red-600'
                          }`}
                        />
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Connected Scholars */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topScholars.slice(0, 8).map((scholar, index) => (
                    <Link
                      key={scholar.id}
                      href={`/scholar/${scholar.id}`}
                      className="block hover:bg-gray-50 p-2 rounded-md -m-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {scholar.name_english}
                          </div>
                          <div className="text-xs text-gray-500">
                            {scholar.birth_year && `${scholar.birth_year}`}
                            {scholar.birth_year && scholar.death_year && '–'}
                            {scholar.death_year && `${scholar.death_year}`}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {scholar.connections}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• <strong>Click</strong> nodes to highlight and view details</p>
                <p>• <strong>Drag</strong> nodes to explore connections</p>
                <p>• <strong>Zoom</strong> and pan to navigate the network</p>
                <p>• <strong>Filter</strong> by relationship type using badges</p>
                <p>• Node size indicates influence level</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}