import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, MapPin, BookOpen, Users, FileText, Library, ExternalLink, Languages, Scroll } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Work, WorkAuthor, Scholar } from '@/lib/types'

interface WorkWithDetails extends Work {
  authors: Array<WorkAuthor & { scholar: Scholar }>
}

async function getWorkData(id: string): Promise<WorkWithDetails | null> {
  try {
    // Fetch work with authors
    const { data: work, error: workError } = await supabase
      .from('works')
      .select(`
        *,
        work_authors!inner(
          *,
          scholar:scholars(*)
        )
      `)
      .eq('id', id)
      .single()

    if (workError || !work) {
      return null
    }

    return {
      ...work,
      authors: work.work_authors || []
    }
  } catch (error) {
    console.error('Error fetching work data:', error)
    return null
  }
}

interface WorkPageProps {
  params: Promise<{ id: string }>
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

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params
  const work = await getWorkData(id)

  if (!work) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <Link 
              href="/works" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Works Catalog
            </Link>
          </div>
          
          <div className="space-y-6">
            {/* Work Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {work.title_english || work.title_transliteration}
                  </h1>
                  {work.title_arabic && (
                    <h2 className="text-2xl text-arabic text-gray-700 mb-2 font-arabic">
                      {work.title_arabic}
                    </h2>
                  )}
                  {work.title_transliteration && work.title_english && (
                    <h3 className="text-xl text-gray-600 mb-4 italic">
                      {work.title_transliteration}
                    </h3>
                  )}
                </div>
                
                {/* Status Badge */}
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${statusColors[work.manuscript_status]}`}
                >
                  {statusLabels[work.manuscript_status]}
                </Badge>
              </div>
            </div>

            {/* Key Details */}
            <div className="flex flex-wrap items-center gap-6 text-lg text-gray-600">
              {work.composition_year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Composed {work.composition_year}</span>
                </div>
              )}
              
              {work.composition_location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{work.composition_location}</span>
                </div>
              )}
              
              {work.genre && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{work.genre}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <span>{work.language}</span>
              </div>
            </div>

            {/* Authors */}
            {work.authors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {work.authors.length === 1 ? 'Author' : 'Authors'}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {work.authors.map((author) => (
                    <div key={author.id} className="flex items-center gap-3 bg-white rounded-lg border p-4">
                      <div>
                        <Link 
                          href={`/scholar/${author.scholar.id}`}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {author.scholar.name_english}
                        </Link>
                        {author.scholar.name_arabic && (
                          <div className="text-sm text-arabic text-gray-600 font-arabic">
                            {author.scholar.name_arabic}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {author.scholar.birth_year && `${author.scholar.birth_year}`}
                          {author.scholar.birth_year && author.scholar.death_year && '–'}
                          {author.scholar.death_year && `${author.scholar.death_year}`}
                        </div>
                      </div>
                      {author.author_role !== 'author' && (
                        <Badge variant="secondary" className="text-xs">
                          {roleLabels[author.author_role]}
                        </Badge>
                      )}
                      {author.attribution_certainty !== 'certain' && (
                        <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                          {author.attribution_certainty}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Areas */}
            {work.subject_area && work.subject_area.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {work.subject_area.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {work.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scroll className="h-5 w-5" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {work.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Publication Details */}
            {work.publication_details && work.manuscript_status === 'published' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Publication Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {work.publication_details}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Manuscript Information */}
            {(work.library_locations && work.library_locations.length > 0) || work.extant_copies > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-5 w-5" />
                    Manuscript Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {work.extant_copies > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Known Copies</h4>
                      <p className="text-gray-700">
                        {work.extant_copies} {work.extant_copies === 1 ? 'copy' : 'copies'} documented
                      </p>
                    </div>
                  )}
                  
                  {work.library_locations && work.library_locations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Library Locations</h4>
                      <div className="space-y-2">
                        {work.library_locations.map((location, index) => (
                          <div key={index} className="flex items-center gap-2 text-gray-700">
                            <Library className="h-4 w-4 text-gray-400" />
                            <span>{location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Notes */}
            {work.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {work.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${statusColors[work.manuscript_status]}`}
                  >
                    {statusLabels[work.manuscript_status]}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Language:</span>
                  <span className="font-medium">{work.language}</span>
                </div>
                
                {work.pages && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pages:</span>
                    <span className="font-medium">{work.pages}</span>
                  </div>
                )}
                
                {work.composition_year && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Composed:</span>
                    <span className="font-medium">{work.composition_year}</span>
                  </div>
                )}
                
                {work.extant_copies > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Known Copies:</span>
                    <span className="font-medium">{work.extant_copies}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {work.authors.map((author) => (
                  <Button key={author.id} variant="secondary" className="w-full justify-start" asChild>
                    <Link href={`/scholar/${author.scholar.id}`}>
                      View {author.scholar.name_english}
                    </Link>
                  </Button>
                ))}
                
                <Button variant="secondary" className="w-full justify-start" asChild>
                  <Link href="/works">
                    Browse All Works
                  </Link>
                </Button>
                
                {work.subject_area && work.subject_area.length > 0 && (
                  <Button variant="secondary" className="w-full justify-start" asChild>
                    <Link href={`/works?subject=${encodeURIComponent(work.subject_area[0])}`}>
                      More {work.subject_area[0]} Works
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Citation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Citation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border font-mono">
                  {work.authors.map(a => a.scholar.name_english).join(', ')}. 
                  &quot;{work.title_english || work.title_transliteration}.&quot;
                  {work.composition_year && ` (${work.composition_year})`}
                  {work.composition_location && `, ${work.composition_location}`}.
                  {work.manuscript_status === 'published' && work.publication_details && 
                    ` ${work.publication_details}`
                  }
                  {work.manuscript_status === 'manuscript' && work.library_locations && work.library_locations.length > 0 &&
                    ` Manuscript held at ${work.library_locations[0]}.`
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}