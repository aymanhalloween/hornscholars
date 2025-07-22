import { getScholarById, getScholarRelationships } from '@/lib/services/search'
import { formatScholarName, calculateScholarAge, formatCentury } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScholarCard } from '@/components/scholar/scholar-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ScholarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const scholar = await getScholarById(id)
  
  if (!scholar) {
    notFound()
  }

  const relationships = await getScholarRelationships(id)
  const names = formatScholarName(scholar.name_arabic, scholar.name_english, scholar.name_somali)
  
  const yearsText = scholar.birth_year && scholar.death_year 
    ? `${scholar.birth_year}–${scholar.death_year}` 
    : scholar.birth_year 
    ? `b. ${scholar.birth_year}` 
    : scholar.death_year 
    ? `d. ${scholar.death_year}` 
    : 'Dates unknown'

  const age = calculateScholarAge(scholar.birth_year, scholar.death_year)
  const century = scholar.birth_year ? formatCentury(scholar.birth_year) : null

  // Group relationships by type
  const teachers = relationships.filter(r => 
    r.relationship_type === 'teacher' && r.related_scholar_id === id
  )
  const students = relationships.filter(r => 
    r.relationship_type === 'student' || (r.relationship_type === 'teacher' && r.scholar_id === id)
  )
  const contemporaries = relationships.filter(r => r.relationship_type === 'contemporary')

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
                {names.primary}
              </h1>
              <div className="mt-2 space-y-1">
                <p className="text-arabic text-xl text-gray-700">
                  {names.arabic}
                </p>
                {names.secondary !== names.arabic && (
                  <p className="text-lg text-gray-600">
                    {names.secondary}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{yearsText}</span>
              {age && <span>• Lived {age} years</span>}
              {century && <span>• {century}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            {scholar.biography && (
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {scholar.biography}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Specializations */}
            {scholar.specializations && scholar.specializations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {scholar.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Locations & Journey */}
            {scholar.locations && scholar.locations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scholar.locations.map((location: any, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {location.name}
                          </h4>
                          <div className="text-sm text-gray-600">
                            <span className="capitalize">{location.location_type}</span>
                            {location.start_year && (
                              <span> • {location.start_year}</span>
                            )}
                            {location.country && location.country !== location.name && (
                              <span> • {location.country}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Relationships */}
          <div className="space-y-6">
            {/* Teachers */}
            {teachers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>👨‍🏫</span>
                    Teachers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teachers.slice(0, 3).map((rel) => (
                      <div key={rel.id}>
                        <Link 
                          href={`/scholar/${rel.scholar.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {rel.scholar.name_english}
                        </Link>
                        <p className="text-sm text-gray-500 text-arabic">
                          {rel.scholar.name_arabic}
                        </p>
                      </div>
                    ))}
                    {teachers.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{teachers.length - 3} more teachers
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Students */}
            {students.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>👨‍🎓</span>
                    Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.slice(0, 3).map((rel) => {
                      const student = rel.scholar_id === id ? rel.related_scholar : rel.scholar
                      return (
                        <div key={rel.id}>
                          <Link 
                            href={`/scholar/${student.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {student.name_english}
                          </Link>
                          <p className="text-sm text-gray-500 text-arabic">
                            {student.name_arabic}
                          </p>
                        </div>
                      )
                    })}
                    {students.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{students.length - 3} more students
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contemporaries */}
            {contemporaries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>🏘️</span>
                    Contemporaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contemporaries.slice(0, 3).map((rel) => {
                      const contemporary = rel.scholar_id === id ? rel.related_scholar : rel.scholar
                      return (
                        <div key={rel.id}>
                          <Link 
                            href={`/scholar/${contemporary.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {contemporary.name_english}
                          </Link>
                          <p className="text-sm text-gray-500 text-arabic">
                            {contemporary.name_arabic}
                          </p>
                        </div>
                      )
                    })}
                    {contemporaries.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{contemporaries.length - 3} more contemporaries
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {scholar.birth_year && (
                  <div>
                    <span className="text-gray-500">Born:</span>{' '}
                    <span className="font-medium">{scholar.birth_year}</span>
                  </div>
                )}
                {scholar.death_year && (
                  <div>
                    <span className="text-gray-500">Died:</span>{' '}
                    <span className="font-medium">{scholar.death_year}</span>
                  </div>
                )}
                {age && (
                  <div>
                    <span className="text-gray-500">Age:</span>{' '}
                    <span className="font-medium">{age} years</span>
                  </div>
                )}
                {scholar.specializations && scholar.specializations.length > 0 && (
                  <div>
                    <span className="text-gray-500">Expertise:</span>{' '}
                    <span className="font-medium">{scholar.specializations.length} fields</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}