'use client'

import * as React from 'react'
import * as d3 from 'd3'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ScholarNetworkNode, ScholarNetworkLink, D3ScholarNetworkLink, Relationship } from '@/lib/types'
import { ZoomIn, ZoomOut, RotateCcw, Filter } from 'lucide-react'

interface ScholarNetworkProps {
  scholars: ScholarNetworkNode[]
  relationships: ScholarNetworkLink[]
  className?: string
  height?: number
}

interface NetworkFilters {
  relationshipType: string | null
  minConnections: number
  showLabels: boolean
}

export function ScholarNetwork({
  scholars,
  relationships,
  className = '',
  height = 600
}: ScholarNetworkProps) {
  const router = useRouter()
  const svgRef = React.useRef<SVGSVGElement>(null)
  const [simulation, setSimulation] = React.useState<d3.Simulation<ScholarNetworkNode, ScholarNetworkLink> | null>(null)
  const [filters, setFilters] = React.useState<NetworkFilters>({
    relationshipType: null,
    minConnections: 0,
    showLabels: true
  })
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null)

  // Filter data based on current filters
  const filteredData = React.useMemo(() => {
    let filteredRelationships = relationships
    
    if (filters.relationshipType) {
      filteredRelationships = relationships.filter(
        r => r.relationship_type === filters.relationshipType
      )
    }

    // Get scholars with minimum connections
    const scholarConnections = new Map<string, number>()
    filteredRelationships.forEach(r => {
      scholarConnections.set(r.source, (scholarConnections.get(r.source) || 0) + 1)
      scholarConnections.set(r.target, (scholarConnections.get(r.target) || 0) + 1)
    })

    const filteredScholars = scholars.filter(
      s => (scholarConnections.get(s.id) || 0) >= filters.minConnections
    )

    const scholarIds = new Set(filteredScholars.map(s => s.id))
    filteredRelationships = filteredRelationships.filter(
      r => scholarIds.has(r.source) && scholarIds.has(r.target)
    )

    return {
      scholars: filteredScholars,
      relationships: filteredRelationships
    }
  }, [scholars, relationships, filters])

  React.useEffect(() => {
    if (!svgRef.current || filteredData.scholars.length === 0) return

    const svg = d3.select(svgRef.current)
    const width = svg.node()?.getBoundingClientRect().width || 800

    // Clear previous content
    svg.selectAll('*').remove()

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Main container group
    const container = svg.append('g')

    // Create arrow markers for directed relationships
    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#666')

    // Create simulation
    const sim = d3.forceSimulation(filteredData.scholars)
      .force('link', d3.forceLink(filteredData.relationships)
        .id(d => (d as ScholarNetworkNode).id)
        .distance(d => {
          const link = d as ScholarNetworkLink
          // Closer distance for stronger relationships
          return link.strength > 0.7 ? 60 : link.strength > 0.4 ? 80 : 100
        }))
      .force('charge', d3.forceManyBody()
        .strength(d => {
          const node = d as ScholarNetworkNode
          // More central nodes have stronger repulsion
          return -(node.centrality_score || 1) * 200 - 100
        }))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => {
          const node = d as ScholarNetworkNode
          return (node.centrality_score || 0.1) * 20 + 15
        }))

    setSimulation(sim)

    // Create links
    const link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(filteredData.relationships)
      .enter().append('line')
      .attr('stroke', d => {
        const colors: Record<string, string> = {
          teacher: '#2563eb',
          student: '#059669',
          contemporary: '#7c3aed',
          location_based: '#dc2626'
        }
        return colors[d.relationship_type] || '#6b7280'
      })
      .attr('stroke-width', d => Math.max(1, d.strength * 3))
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', d => d.relationship_type === 'teacher' ? 'url(#arrowhead)' : null)

    // Create nodes
    const node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(filteredData.scholars)
      .enter().append('circle')
      .attr('r', d => Math.max(5, (d.centrality_score || 0.1) * 15 + 5))
      .attr('fill', d => {
        if (selectedNode === d.id) return '#f59e0b'
        return d.centrality_score && d.centrality_score > 0.7 ? '#dc2626' : 
               d.centrality_score && d.centrality_score > 0.4 ? '#2563eb' : '#6b7280'
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, ScholarNetworkNode>()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))
      .on('click', (event, d) => {
        setSelectedNode(d.id === selectedNode ? null : d.id)
        router.push(`/scholar/${d.id}`)
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', Math.max(8, (d.centrality_score || 0.1) * 15 + 8))
        
        // Show tooltip
        const tooltip = container.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${d.x},${d.y})`)
        
        const text = tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', -20)
          .attr('fill', '#1f2937')
          .attr('font-weight', 'bold')
          .attr('font-size', '12px')
          .text(d.name)
        
        const bbox = (text.node() as SVGTextElement).getBBox()
        tooltip.insert('rect', 'text')
          .attr('x', bbox.x - 4)
          .attr('y', bbox.y - 2)
          .attr('width', bbox.width + 8)
          .attr('height', bbox.height + 4)
          .attr('fill', 'white')
          .attr('stroke', '#d1d5db')
          .attr('rx', 4)
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', Math.max(5, (d.centrality_score || 0.1) * 15 + 5))
        container.select('.tooltip').remove()
      })

    // Create labels if enabled
    if (filters.showLabels) {
      const label = container.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(filteredData.scholars.filter(d => (d.centrality_score || 0) > 0.3))
        .enter().append('text')
        .text(d => d.name.split(' ').slice(0, 2).join(' '))
        .attr('font-size', '10px')
        .attr('font-family', 'Inter, sans-serif')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('fill', '#374151')
        .style('pointer-events', 'none')
    }

    // Update positions on simulation tick
    sim.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x!)
        .attr('y1', d => (d.source as any).y!)
        .attr('x2', d => (d.target as any).x!)
        .attr('y2', d => (d.target as any).y!)

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!)

      if (filters.showLabels) {
        container.selectAll('.labels text')
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y)
      }
    })

    // Cleanup function
    return () => {
      sim.stop()
    }
  }, [filteredData, selectedNode, filters, height, router])

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.2
      )
    }
  }

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.8
      )
    }
  }

  const handleReset = () => {
    if (svgRef.current) {
      d3.select(svgRef.current).transition().call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity
      )
    }
    setSelectedNode(null)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Scholar Network</CardTitle>
          <div className="flex items-center gap-2">
            {/* Network Controls */}
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Relationship:</span>
            {['teacher', 'student', 'contemporary', 'location_based'].map(type => (
              <Badge
                key={type}
                variant={filters.relationshipType === type ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  relationshipType: prev.relationshipType === type ? null : type
                }))}
              >
                {type.replace('_', ' ')}
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(prev => ({ ...prev, showLabels: !prev.showLabels }))}
            className={filters.showLabels ? 'text-blue-600' : ''}
          >
            Labels
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Highly Influential</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span>Moderately Influential</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Standard</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          className="border rounded-b-lg"
          style={{ background: '#fafafa' }}
        />
      </CardContent>
    </Card>
  )
}