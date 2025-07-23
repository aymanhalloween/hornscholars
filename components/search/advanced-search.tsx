'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SearchFilters } from '@/lib/types'
import { X, Filter, Search } from 'lucide-react'

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  onClear: () => void
  initialQuery?: string
  initialFilters?: SearchFilters
}

const LOCATIONS = [
  'Harar', 'Zeila', 'Mogadishu', 'Berbera', 'Jigjiga', 'Dire Dawa',
  'Mecca', 'Medina', 'Cairo', 'Damascus', 'Baghdad'
]

const SPECIALIZATIONS = [
  'Fiqh', 'Hadith', 'Theology', 'Sufism', 'Arabic Literature', 
  'Quranic Studies', 'Islamic Law', 'Astronomy', 'Mathematics',
  'Islamic Sciences', 'Education', "Women's Education"
]

const SCHOOLS_OF_THOUGHT = [
  'Hanafi', 'Shafi', 'Maliki', 'Hanbali', 'Ash\'ari', 'Maturidi', 'Sufi Orders'
]

const CENTURIES = [
  { value: 14, label: '14th Century (1300-1399)' },
  { value: 15, label: '15th Century (1400-1499)' },
  { value: 16, label: '16th Century (1500-1599)' },
  { value: 17, label: '17th Century (1600-1699)' },
  { value: 18, label: '18th Century (1700-1799)' },
  { value: 19, label: '19th Century (1800-1899)' },
  { value: 20, label: '20th Century (1900-1999)' },
]

export function AdvancedSearch({ 
  onSearch, 
  onClear, 
  initialQuery = '', 
  initialFilters = {} 
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState(initialQuery)
  const [filters, setFilters] = React.useState<SearchFilters>(initialFilters)

  const updateFilter = <K extends keyof SearchFilters>(
    key: K, 
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === prev[key] ? undefined : value
    }))
  }

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const handleClear = () => {
    setQuery('')
    setFilters({})
    onClear()
  }

  const hasActiveFilters = Object.values(filters).some(Boolean)
  const filterCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search scholars by name, location, or specialization..."
          className="pl-10 pr-24 py-3 text-base rounded-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="absolute right-2 top-1.5 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={`text-xs ${hasActiveFilters ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters {filterCount > 0 && `(${filterCount})`}
          </Button>
          <Button onClick={handleSearch} size="sm" className="px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('location', undefined)}
              />
            </Badge>
          )}
          {filters.century && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {CENTURIES.find(c => c.value === filters.century)?.label.split(' ')[0]}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('century', undefined)}
              />
            </Badge>
          )}
          {filters.specialization && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.specialization}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('specialization', undefined)}
              />
            </Badge>
          )}
          {filters.school_of_thought && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.school_of_thought}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('school_of_thought', undefined)}
              />
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {isOpen && (
        <Card className="border-t">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map(location => (
                  <Badge
                    key={location}
                    variant={filters.location === location ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilter('location', location)}
                  >
                    {location}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Century Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Time Period</h4>
              <div className="flex flex-wrap gap-2">
                {CENTURIES.map(century => (
                  <Badge
                    key={century.value}
                    variant={filters.century === century.value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilter('century', century.value)}
                  >
                    {century.label.split(' ')[0]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Specialization Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Specialization</h4>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map(spec => (
                  <Badge
                    key={spec}
                    variant={filters.specialization === spec ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilter('specialization', spec)}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* School of Thought Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">School of Thought</h4>
              <div className="flex flex-wrap gap-2">
                {SCHOOLS_OF_THOUGHT.map(school => (
                  <Badge
                    key={school}
                    variant={filters.school_of_thought === school ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => updateFilter('school_of_thought', school)}
                  >
                    {school}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleClear}>
                Clear All Filters
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}