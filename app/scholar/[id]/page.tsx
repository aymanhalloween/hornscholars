import { getScholarById, getScholarRelationships } from '@/lib/services/search'
import { formatScholarName, calculateScholarAge, formatCentury } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScholarCard } from '@/components/scholar/scholar-card'
import { ScholarWorks } from '@/components/scholar/scholar-works'
import { AutoLinkedText } from '@/components/ui/auto-linked-text'
import { supabase } from '@/lib/supabase/client'
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
  
  // Fetch scholar's works
  const { data: works } = await supabase
    .from('work_authors')
    .select(`
      *,
      work:works(*)
    `)
    .eq('scholar_id', id)
  
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
              href="/scholars" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Scholars
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

            <div className="flex flex-wrap items-center gap-4 text-lg text-gray-600">
              <span className="font-medium">{yearsText}</span>
              {age && <span>• Lived {age} years</span>}
              {century && <span>• {century}</span>}
            </div>

            {/* Scholarly Impact Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarly Legacy</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">{students.length}</div>
                  <div className="text-sm text-gray-600">Students Taught</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">{(works || []).length}</div>
                  <div className="text-sm text-gray-600">Works Authored</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-purple-600">{teachers.length}</div>
                  <div className="text-sm text-gray-600">Scholarly Lineage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-amber-600">{contemporaries.length}</div>
                  <div className="text-sm text-gray-600">Peer Network</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography & Intellectual Profile */}
            {scholar.biography && (
              <Card className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">Life & Intellectual Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-gray max-w-none">
                    <AutoLinkedText 
                      className="text-gray-700 leading-relaxed text-lg"
                      excludeCurrentEntity={scholar.id}
                      as="p"
                    >
                      {scholar.biography}
                    </AutoLinkedText>
                  </div>
                  
                  {/* Enhanced biographical context based on available data */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Historical Context</h4>
                    <AutoLinkedText 
                      className="text-gray-700 leading-relaxed"
                      excludeCurrentEntity={scholar.id}
                      as="p"
                    >
                      {`${scholar.name_english} lived during the ${century?.toLowerCase() || 'medieval period'}, a significant era in the intellectual history of the Horn of Africa. ${scholar.birth_location ? `Born in ${scholar.birth_location}, they were part of the rich scholarly tradition of the region.` : ''}${teachers.length > 0 ? ` Their education under ${teachers.length} prominent ${teachers.length === 1 ? 'teacher' : 'teachers'} shaped their intellectual development.` : ''}${students.length > 0 ? ` As an educator, they influenced ${students.length} ${students.length === 1 ? 'student' : 'students'}, continuing the chain of Islamic scholarship.` : ''}`}
                    </AutoLinkedText>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scholarly Expertise & Contributions */}
            {scholar.specializations && scholar.specializations.length > 0 && (
              <Card className="border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="text-xl text-green-900">Scholarly Expertise & Contributions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Fields of Specialization</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scholar.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notable Contributions */}
                  {scholar.notable_contributions && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Notable Contributions</h4>
                      <div className="prose prose-gray max-w-none">
                        <AutoLinkedText 
                          className="text-gray-700 leading-relaxed"
                          excludeCurrentEntity={scholar.id}
                          as="p"
                        >
                          {scholar.notable_contributions}
                        </AutoLinkedText>
                      </div>
                    </div>
                  )}

                  {/* Major Works List */}
                  {scholar.major_works && scholar.major_works.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Major Works</h4>
                      <div className="space-y-2">
                        {scholar.major_works.map((work, index) => (
                          <div key={index} className="flex items-start gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <AutoLinkedText 
                              className="leading-relaxed"
                              excludeCurrentEntity={scholar.id}
                              linkWorks={true}
                              linkScholars={false}
                              as="span"
                            >
                              {work}
                            </AutoLinkedText>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scholarly Achievements */}
                  {scholar.scholarly_achievements && scholar.scholarly_achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Scholarly Achievements</h4>
                      <div className="space-y-2">
                        {scholar.scholarly_achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intellectual Lineage */}
                  {scholar.intellectual_lineage && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Intellectual Lineage</h4>
                      <div className="prose prose-gray max-w-none">
                        <AutoLinkedText 
                          className="text-gray-700 leading-relaxed"
                          excludeCurrentEntity={scholar.id}
                          as="p"
                        >
                          {scholar.intellectual_lineage}
                        </AutoLinkedText>
                      </div>
                    </div>
                  )}

                  {/* Scholarly Impact */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Scholarly Impact</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-blue-600">
                          {scholar.manuscripts_authored || (works || []).length}
                        </div>
                        <div className="text-xs text-gray-500">Works Authored</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-green-600">
                          {students.length}
                        </div>
                        <div className="text-xs text-gray-500">Students Taught</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-purple-600">
                          {scholar.specializations?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Specializations</div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-amber-600">
                          {scholar.teaching_years_start && scholar.teaching_years_end 
                            ? scholar.teaching_years_end - scholar.teaching_years_start 
                            : '—'}
                        </div>
                        <div className="text-xs text-gray-500">Teaching Years</div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {scholar.name_english} was recognized as an authority in {scholar.specializations?.length > 1 ? 'multiple fields' : scholar.specializations?.[0] || 'Islamic scholarship'}.
                      {scholar.major_works && scholar.major_works.length > 0 && ` Their ${scholar.major_works.length} major works contributed significantly to their fields of expertise.`}
                      {students.length > 0 && ` Through teaching ${students.length} ${students.length === 1 ? 'student' : 'students'}, they ensured the continuation of their scholarly traditions.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Educational & Teaching Journey */}
            {(teachers.length > 0 || students.length > 0 || (scholar.locations && scholar.locations.length > 0) || (scholar.teaching_positions && scholar.teaching_positions.length > 0)) && (
              <Card className="border-l-4 border-l-purple-600">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-900">Educational & Teaching Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Education */}
                  {teachers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Scholarly Formation</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {scholar.name_english} received their education from {teachers.length} distinguished {teachers.length === 1 ? 'teacher' : 'teachers'}, 
                        which shaped their intellectual development and scholarly methodology.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {teachers.slice(0, 4).map((rel) => (
                          <div key={rel.id} className="bg-gray-50 rounded-lg p-3">
                            <Link 
                              href={`/scholar/${rel.scholar.id}`}
                              className="font-medium text-blue-600 hover:text-blue-700"
                            >
                              {rel.scholar.name_english}
                            </Link>
                            <p className="text-sm text-gray-500 text-arabic">
                              {rel.scholar.name_arabic}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teaching Positions */}
                  {scholar.teaching_positions && scholar.teaching_positions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Teaching Positions</h4>
                      <div className="space-y-3">
                        {scholar.teaching_positions.map((position, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-700 leading-relaxed">{position}</p>
                              {scholar.teaching_years_start && scholar.teaching_years_end && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {scholar.teaching_years_start}–{scholar.teaching_years_end}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Geographic Journey */}
                  {scholar.locations && scholar.locations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Geographic Journey</h4>
                      <div className="space-y-3">
                        {scholar.locations.map((location: any, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {location.name}
                              </h5>
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
                    </div>
                  )}

                  {/* Notable Students from enhanced fields */}
                  {scholar.students && scholar.students.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Notable Students</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {scholar.name_english} taught and influenced many students, including these notable scholars who carried forward their intellectual legacy.
                      </p>
                      <div className="space-y-2">
                        {scholar.students.map((student, index) => (
                          <div key={index} className="flex items-start gap-2 text-gray-700">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{student}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teaching Legacy from relationships */}
                  {students.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Documented Teacher-Student Relationships</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        As an educator, {scholar.name_english} had documented relationships with {students.length} {students.length === 1 ? 'student' : 'students'}, 
                        demonstrating their role in the transmission of knowledge.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {students.slice(0, 4).map((rel) => {
                          const student = rel.scholar_id === id ? rel.related_scholar : rel.scholar
                          return (
                            <div key={rel.id} className="bg-gray-50 rounded-lg p-3">
                              <Link 
                                href={`/scholar/${student.id}`}
                                className="font-medium text-blue-600 hover:text-blue-700"
                              >
                                {student.name_english}
                              </Link>
                              <p className="text-sm text-gray-500 text-arabic">
                                {student.name_arabic}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Major Works Summary */}
            {(works || []).length > 0 && (
              <Card className="border-l-4 border-l-amber-600">
                <CardHeader>
                  <CardTitle className="text-xl text-amber-900">Literary Contributions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {scholar.name_english} authored {(works || []).length} documented {(works || []).length === 1 ? 'work' : 'works'}, 
                    contributing significantly to Islamic scholarship in the Horn of Africa. 
                    Their writings demonstrate deep expertise in their fields of specialization and continue to influence scholars today.
                  </p>

                  {/* Key Works (Top 3) */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Notable Works</h4>
                    <div className="space-y-3">
                      {(works || []).slice(0, 3).map((workAuthor: any) => (
                        <div key={workAuthor.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                <Link 
                                  href={`/works/${workAuthor.work.id}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {workAuthor.work.title_english || workAuthor.work.title_transliteration}
                                </Link>
                              </h5>
                              {workAuthor.work.title_arabic && (
                                <p className="text-sm text-arabic text-gray-600 font-arabic mt-1">
                                  {workAuthor.work.title_arabic}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                {workAuthor.work.composition_year && (
                                  <span>{workAuthor.work.composition_year}</span>
                                )}
                                {workAuthor.work.genre && (
                                  <span>• {workAuthor.work.genre}</span>
                                )}
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                workAuthor.work.manuscript_status === 'published' ? 'bg-green-100 text-green-800' :
                                workAuthor.work.manuscript_status === 'manuscript' ? 'bg-blue-100 text-blue-800' :
                                workAuthor.work.manuscript_status === 'lost' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {workAuthor.work.manuscript_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(works || []).length > 3 && (
                    <div className="text-center pt-4 border-t">
                      <Link 
                        href={`/works?author=${encodeURIComponent(scholar.name_english)}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All {(works || []).length} Works →
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Scholar Network */}
          <div className="space-y-6">
            {/* Scholarly Network Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Scholarly Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{teachers.length}</div>
                    <div className="text-xs text-gray-500">Teachers</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{students.length}</div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-purple-600">{contemporaries.length}</div>
                    <div className="text-xs text-gray-500">Peers</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-amber-600">{(works || []).length}</div>
                    <div className="text-xs text-gray-500">Works</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {scholar.birth_year && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Born:</span>
                    <span className="font-medium">{scholar.birth_year}</span>
                  </div>
                )}
                {scholar.death_year && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Died:</span>
                    <span className="font-medium">{scholar.death_year}</span>
                  </div>
                )}
                {age && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lifespan:</span>
                    <span className="font-medium">{age} years</span>
                  </div>
                )}
                {century && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Period:</span>
                    <span className="font-medium">{century}</span>
                  </div>
                )}
                {scholar.birth_location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Origin:</span>
                    <span className="font-medium text-right max-w-32 truncate" title={scholar.birth_location}>
                      {scholar.birth_location.split(',')[0]}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contemporary Scholars */}
            {contemporaries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contemporary Scholars</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contemporaries.slice(0, 4).map((rel) => {
                      const contemporary = rel.scholar_id === id ? rel.related_scholar : rel.scholar
                      return (
                        <Link
                          key={rel.id}
                          href={`/scholar/${contemporary.id}`}
                          className="block hover:bg-gray-50 p-2 rounded-md -m-2"
                        >
                          <div className="font-medium text-sm text-blue-600 hover:text-blue-700">
                            {contemporary.name_english}
                          </div>
                          <div className="text-xs text-gray-500 text-arabic">
                            {contemporary.name_arabic}
                          </div>
                        </Link>
                      )
                    })}
                    {contemporaries.length > 4 && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        +{contemporaries.length - 4} more contemporaries
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Explore More */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Explore Further</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  href={`/network?scholar=${id}`}
                  className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  View Network Graph
                </Link>
                <Link 
                  href={`/timeline?century=${Math.floor((scholar.birth_year || 1500) / 100) + 1}`}
                  className="block w-full text-center bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  View Timeline Period
                </Link>
                {scholar.birth_location && (
                  <Link 
                    href={`/search?location=${encodeURIComponent(scholar.birth_location.split(',')[0])}`}
                    className="block w-full text-center bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Scholars from {scholar.birth_location.split(',')[0]}
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}