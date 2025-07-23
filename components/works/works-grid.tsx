'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, MapPin, User, FileText, Library } from 'lucide-react'
import Link from 'next/link'
import type { Work, WorkAuthor } from '@/lib/types'

interface WorkWithAuthors extends Work {
  authors: WorkAuthor[]
}

interface WorksGridProps {
  works: WorkWithAuthors[]
}

const statusColors = {
  published: 'bg-green-100 text-green-800 border-green-200',
  manuscript: 'bg-blue-100 text-blue-800 border-blue-200',
  lost: 'bg-red-100 text-red-800 border-red-200',
  unknown: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusLabels = {
  published: 'Published',
  manuscript: 'Manuscript',
  lost: 'Lost',
  unknown: 'Unknown'
}

export function WorksGrid({ works }: WorksGridProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No works found</h3>
        <p className="mt-2 text-gray-600">
          Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {works.map((work) => (
        <Card key={work.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-6">
                  <Link 
                    href={`/works/${work.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {work.title_english || work.title_transliteration}
                  </Link>
                </CardTitle>
                {work.title_arabic && (
                  <div className="text-sm text-arabic text-gray-600 mt-1 font-arabic">
                    {work.title_arabic}
                  </div>
                )}
                {work.title_transliteration && work.title_english && (
                  <div className="text-sm text-gray-500 mt-1 italic">
                    {work.title_transliteration}
                  </div>
                )}
              </div>
              <Badge 
                variant="outline" 
                className={statusColors[work.manuscript_status]}
              >
                {statusLabels[work.manuscript_status]}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Authors */}
            {work.authors.length > 0 && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {work.authors.slice(0, 2).map((author, index) => (
                    <Link
                      key={author.scholar_id}
                      href={`/scholar/${author.scholar_id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      {author.scholar?.name_english}
                      {index < work.authors.slice(0, 2).length - 1 && ', '}
                    </Link>
                  ))}
                  {work.authors.length > 2 && (
                    <span className="text-sm text-gray-500">
                      +{work.authors.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Composition Details */}
            <div className="space-y-2">
              {work.composition_year && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Composed {work.composition_year}</span>
                </div>
              )}
              
              {work.composition_location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{work.composition_location}</span>
                </div>
              )}
              
              {work.genre && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  <span>{work.genre}</span>
                </div>
              )}
              
              {work.pages && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{work.pages} pages</span>
                </div>
              )}
              
              {work.extant_copies > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Library className="h-4 w-4" />
                  <span>{work.extant_copies} known copies</span>
                </div>
              )}
            </div>

            {/* Subject Areas */}
            {work.subject_area && work.subject_area.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {work.subject_area.slice(0, 3).map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {work.subject_area.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{work.subject_area.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Description */}
            {work.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {work.description}
              </p>
            )}

            {/* Action */}
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/works/${work.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}