'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, MapPin, FileText, Library, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Work, WorkAuthor } from '@/lib/types'

interface ScholarWorksProps {
  works: Array<WorkAuthor & { work: Work }>
  scholarName: string
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

const roleLabels = {
  author: 'Author',
  'co-author': 'Co-Author',
  translator: 'Translator',
  commentator: 'Commentator',
  editor: 'Editor'
}

export function ScholarWorks({ works, scholarName }: ScholarWorksProps) {
  if (works.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Major Works & Publications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">
              No documented works found for {scholarName}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may indicate that their works have been lost to history or are not yet cataloged in our database.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group works by status
  const published = works.filter(w => w.work.manuscript_status === 'published')
  const manuscripts = works.filter(w => w.work.manuscript_status === 'manuscript')
  const lost = works.filter(w => w.work.manuscript_status === 'lost')
  const unknown = works.filter(w => w.work.manuscript_status === 'unknown')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Major Works & Publications ({works.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{published.length}</div>
            <div className="text-xs text-gray-500">Published</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{manuscripts.length}</div>
            <div className="text-xs text-gray-500">Manuscripts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">{lost.length}</div>
            <div className="text-xs text-gray-500">Lost</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">{unknown.length}</div>
            <div className="text-xs text-gray-500">Unknown</div>
          </div>
        </div>

        {/* Works List */}
        <div className="space-y-4">
          {works
            .sort((a, b) => {
              // Sort by composition year (most recent first), then by status priority
              const yearA = a.work.composition_year || 0
              const yearB = b.work.composition_year || 0
              if (yearA !== yearB) return yearB - yearA
              
              const statusPriority = { published: 4, manuscript: 3, unknown: 2, lost: 1 }
              return statusPriority[b.work.manuscript_status] - statusPriority[a.work.manuscript_status]
            })
            .map((workAuthor) => {
              const work = workAuthor.work
              return (
                <div 
                  key={workAuthor.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 leading-6">
                            <Link 
                              href={`/works/${work.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {work.title_english || work.title_transliteration}
                            </Link>
                          </h3>
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
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${statusColors[work.manuscript_status]}`}
                          >
                            {statusLabels[work.manuscript_status]}
                          </Badge>
                          {workAuthor.author_role !== 'author' && (
                            <Badge variant="secondary" className="text-xs">
                              {roleLabels[workAuthor.author_role]}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {work.composition_year && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Composed {work.composition_year}</span>
                        </div>
                      )}
                      
                      {work.composition_location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{work.composition_location}</span>
                        </div>
                      )}
                      
                      {work.genre && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{work.genre}</span>
                        </div>
                      )}
                      
                      {work.pages && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{work.pages} pages</span>
                        </div>
                      )}
                      
                      {work.extant_copies > 0 && (
                        <div className="flex items-center gap-1">
                          <Library className="h-4 w-4" />
                          <span>{work.extant_copies} copies</span>
                        </div>
                      )}
                    </div>

                    {/* Subject Areas */}
                    {work.subject_area && work.subject_area.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {work.subject_area.slice(0, 4).map((subject) => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {work.subject_area.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{work.subject_area.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {work.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {work.description}
                      </p>
                    )}

                    {/* Publication Details */}
                    {work.publication_details && work.manuscript_status === 'published' && (
                      <div className="text-sm text-gray-600 bg-green-50 p-2 rounded border border-green-200 mt-2">
                        <strong>Publication:</strong> {work.publication_details}
                      </div>
                    )}

                    {/* Library Locations */}
                    {work.library_locations && work.library_locations.length > 0 && (
                      <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-200 mt-2">
                        <strong>Manuscript locations:</strong> {work.library_locations.join(', ')}
                      </div>
                    )}

                    {/* Attribution Certainty */}
                    {workAuthor.attribution_certainty !== 'certain' && (
                      <div className="text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                        <strong>Attribution:</strong> {workAuthor.attribution_certainty}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-2 mt-3 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/works/${work.id}`} className="flex items-center gap-1">
                          View Details
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                      
                      <div className="text-xs text-gray-500">
                        {work.language} • {work.manuscript_status}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* View All Works Link */}
        {works.length > 3 && (
          <div className="text-center pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href={`/works?author=${encodeURIComponent(scholarName)}`}>
                View All {works.length} Works by {scholarName}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}