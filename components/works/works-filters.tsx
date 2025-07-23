'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Filter, X } from 'lucide-react'

interface WorksFiltersProps {
  onFiltersChange?: (filters: WorksFilterOptions) => void
}

interface WorksFilterOptions {
  status: string[]
  genres: string[]
  subjects: string[]
  yearRange: { min: number | null; max: number | null }
  searchTerm: string
}

const MANUSCRIPT_STATUSES = [
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
  { value: 'manuscript', label: 'Manuscript', color: 'bg-blue-100 text-blue-800' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
  { value: 'unknown', label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
]

const COMMON_GENRES = [
  'Theological treatise',
  'Legal manual',
  'Poetry collection',
  'Educational treatise',
  'Quranic commentary',
  'Hadith compilation',
  'Sufi guide',
  'Historical chronicle',
  'Biographical dictionary',
  'Literary anthology'
]

const SUBJECT_AREAS = [
  'Theology',
  'Islamic Jurisprudence',
  'Fiqh',
  'Islamic Law',
  'Sufism',
  'Poetry',
  'Spirituality',
  'Education',
  'Ethics',
  'Islamic Pedagogy',
  'Quranic Studies',
  'Exegesis',
  'Hadith Studies',
  'Arabic Literature',
  'Islamic History',
  'Philosophy'
]

export function WorksFilters({ onFiltersChange }: WorksFiltersProps) {
  const [filters, setFilters] = React.useState<WorksFilterOptions>({
    status: [],
    genres: [],
    subjects: [],
    yearRange: { min: null, max: null },
    searchTerm: ''
  })

  const [showAllGenres, setShowAllGenres] = React.useState(false)
  const [showAllSubjects, setShowAllSubjects] = React.useState(false)

  const updateFilters = React.useCallback((newFilters: WorksFilterOptions) => {
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }, [onFiltersChange])

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked 
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status)
    updateFilters({ ...filters, status: newStatus })
  }

  const handleGenreChange = (genre: string, checked: boolean) => {
    const newGenres = checked
      ? [...filters.genres, genre]
      : filters.genres.filter(g => g !== genre)
    updateFilters({ ...filters, genres: newGenres })
  }

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const newSubjects = checked
      ? [...filters.subjects, subject]
      : filters.subjects.filter(s => s !== subject)
    updateFilters({ ...filters, subjects: newSubjects })
  }

  const clearAllFilters = () => {
    updateFilters({
      status: [],
      genres: [],
      subjects: [],
      yearRange: { min: null, max: null },
      searchTerm: ''
    })
  }

  const hasActiveFilters = filters.status.length > 0 || 
                         filters.genres.length > 0 || 
                         filters.subjects.length > 0 || 
                         filters.yearRange.min !== null || 
                         filters.yearRange.max !== null ||
                         filters.searchTerm.length > 0

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700 h-8 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search Works</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search titles, authors, descriptions..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Manuscript Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Manuscript Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {MANUSCRIPT_STATUSES.map(status => (
            <div key={status.value} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status.value}`}
                checked={filters.status.includes(status.value)}
                onCheckedChange={(checked) => 
                  handleStatusChange(status.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`status-${status.value}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Badge variant="outline" className={`text-xs ${status.color}`}>
                  {status.label}
                </Badge>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Year Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Composition Year</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="year-min" className="text-xs text-gray-600">From</Label>
              <Input
                id="year-min"
                type="number"
                placeholder="1400"
                value={filters.yearRange.min || ''}
                onChange={(e) => updateFilters({
                  ...filters,
                  yearRange: { ...filters.yearRange, min: e.target.value ? parseInt(e.target.value) : null }
                })}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="year-max" className="text-xs text-gray-600">To</Label>
              <Input
                id="year-max"
                type="number"
                placeholder="1600"
                value={filters.yearRange.max || ''}
                onChange={(e) => updateFilters({
                  ...filters,
                  yearRange: { ...filters.yearRange, max: e.target.value ? parseInt(e.target.value) : null }
                })}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Genre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {COMMON_GENRES.slice(0, showAllGenres ? undefined : 5).map(genre => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={filters.genres.includes(genre)}
                onCheckedChange={(checked) => 
                  handleGenreChange(genre, checked as boolean)
                }
              />
              <Label 
                htmlFor={`genre-${genre}`}
                className="text-sm cursor-pointer"
              >
                {genre}
              </Label>
            </div>
          ))}
          {COMMON_GENRES.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllGenres(!showAllGenres)}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              {showAllGenres ? 'Show Less' : `Show ${COMMON_GENRES.length - 5} More`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Subject Areas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Subject Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SUBJECT_AREAS.slice(0, showAllSubjects ? undefined : 6).map(subject => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${subject}`}
                checked={filters.subjects.includes(subject)}
                onCheckedChange={(checked) => 
                  handleSubjectChange(subject, checked as boolean)
                }
              />
              <Label 
                htmlFor={`subject-${subject}`}
                className="text-sm cursor-pointer"
              >
                {subject}
              </Label>
            </div>
          ))}
          {SUBJECT_AREAS.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
            >
              {showAllSubjects ? 'Show Less' : `Show ${SUBJECT_AREAS.length - 6} More`}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}