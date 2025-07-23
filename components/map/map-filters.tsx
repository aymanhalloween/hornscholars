'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface MapFiltersProps {
  onFiltersChange?: (filters: MapFilterOptions) => void
}

interface MapFilterOptions {
  centuries: string[]
  minScholarCount: number
  countries: string[]
  showConnections: boolean
}

export function MapFilters({ onFiltersChange }: MapFiltersProps) {
  const [filters, setFilters] = useState<MapFilterOptions>({
    centuries: [],
    minScholarCount: 1,
    countries: [],
    showConnections: false
  })

  const centuries = [
    '15th Century',
    '16th Century', 
    '17th Century',
    '18th Century',
    '19th Century',
    '20th Century'
  ]

  const countries = [
    'Somalia',
    'Ethiopia',
    'Eritrea',
    'Djibouti',
    'Yemen',
    'Saudi Arabia'
  ]

  const handleCenturyToggle = (century: string) => {
    const newCenturies = filters.centuries.includes(century)
      ? filters.centuries.filter(c => c !== century)
      : [...filters.centuries, century]
    
    const newFilters = { ...filters, centuries: newCenturies }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleCountryToggle = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter(c => c !== country)
      : [...filters.countries, country]
    
    const newFilters = { ...filters, countries: newCountries }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleMinScholarCountChange = (count: number) => {
    const newFilters = { ...filters, minScholarCount: count }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearAllFilters = () => {
    const newFilters = {
      centuries: [],
      minScholarCount: 1,
      countries: [],
      showConnections: false
    }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const hasActiveFilters = filters.centuries.length > 0 || 
                          filters.countries.length > 0 || 
                          filters.minScholarCount > 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Map Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Period Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Time Periods</h4>
          <div className="space-y-2">
            {centuries.map((century) => (
              <div key={century} className="flex items-center space-x-2">
                <Checkbox
                  id={`century-${century}`}
                  checked={filters.centuries.includes(century)}
                  onCheckedChange={() => handleCenturyToggle(century)}
                />
                <Label 
                  htmlFor={`century-${century}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {century}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Minimum Scholar Count */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Minimum Scholars</h4>
          <div className="space-y-2">
            {[1, 2, 3, 5, 10].map((count) => (
              <Button
                key={count}
                variant={filters.minScholarCount === count ? "primary" : "outline"}
                size="sm"
                onClick={() => handleMinScholarCountChange(count)}
                className="w-full justify-start text-sm"
              >
                {count === 1 ? 'Show All' : `${count}+ scholars`}
              </Button>
            ))}
          </div>
        </div>

        {/* Country Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Countries/Regions</h4>
          <div className="space-y-2">
            {countries.map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={filters.countries.includes(country)}
                  onCheckedChange={() => handleCountryToggle(country)}
                />
                <Label 
                  htmlFor={`country-${country}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {country}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Map Display Options */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Display Options</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-connections"
                checked={filters.showConnections}
                onCheckedChange={(checked) => {
                  const newFilters = { ...filters, showConnections: checked as boolean }
                  setFilters(newFilters)
                  onFiltersChange?.(newFilters)
                }}
              />
              <Label 
                htmlFor="show-connections"
                className="text-sm font-normal cursor-pointer"
              >
                Show scholar connections
              </Label>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Active Filters</h4>
            <div className="flex flex-wrap gap-1">
              {filters.centuries.map((century) => (
                <Badge key={century} variant="secondary" className="text-xs">
                  {century}
                </Badge>
              ))}
              {filters.countries.map((country) => (
                <Badge key={country} variant="secondary" className="text-xs">
                  {country}
                </Badge>
              ))}
              {filters.minScholarCount > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.minScholarCount}+ scholars
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Quick Views</h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newFilters = { ...filters, centuries: ['15th Century', '16th Century'] }
                setFilters(newFilters)
                onFiltersChange?.(newFilters)
              }}
              className="w-full justify-start text-xs"
            >
              Early Period (15th-16th C.)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newFilters = { ...filters, minScholarCount: 5 }
                setFilters(newFilters)
                onFiltersChange?.(newFilters)
              }}
              className="w-full justify-start text-xs"
            >
              Major Centers Only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newFilters = { ...filters, countries: ['Somalia', 'Ethiopia'] }
                setFilters(newFilters)
                onFiltersChange?.(newFilters)
              }}
              className="w-full justify-start text-xs"
            >
              Horn of Africa Core
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}