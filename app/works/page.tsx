import { supabase } from '@/lib/supabase/client'
import { WorksGrid } from '@/components/works/works-grid'
import { WorksFilters } from '@/components/works/works-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Work, WorkAuthor } from '@/lib/types'

interface WorkWithAuthors extends Work {
  authors: WorkAuthor[]
}

async function getWorksData() {
  try {
    // Fetch works with their authors
    const { data: works, error } = await supabase
      .from('works')
      .select(`
        *,
        work_authors!inner(
          author_role,
          attribution_certainty,
          scholar:scholars(
            id,
            name_english,
            name_arabic
          )
        )
      `)
      .order('composition_year', { ascending: false })

    if (error) throw error

    // Transform data to include authors
    const worksWithAuthors: WorkWithAuthors[] = (works || []).map(work => ({
      ...work,
      authors: work.work_authors || []
    }))

    // Calculate statistics
    const stats = {
      total: worksWithAuthors.length,
      published: worksWithAuthors.filter(w => w.manuscript_status === 'published').length,
      manuscript: worksWithAuthors.filter(w => w.manuscript_status === 'manuscript').length,
      lost: worksWithAuthors.filter(w => w.manuscript_status === 'lost').length,
      unknown: worksWithAuthors.filter(w => w.manuscript_status === 'unknown').length,
      genres: Array.from(new Set(worksWithAuthors.map(w => w.genre).filter(Boolean))).length,
      subjects: Array.from(new Set(worksWithAuthors.flatMap(w => w.subject_area || []))).length
    }

    return { works: worksWithAuthors, stats }
  } catch (error) {
    console.error('Error fetching works:', error)
    return { works: [], stats: { total: 0, published: 0, manuscript: 0, lost: 0, unknown: 0, genres: 0, subjects: 0 } }
  }
}

export default async function WorksPage() {
  const { works, stats } = await getWorksData()

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
                Scholarly Works Database
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Comprehensive catalog of Islamic scholarly works from the Horn of Africa. 
                Browse manuscripts, published works, and lost texts spanning centuries of intellectual tradition.
              </p>
            </div>

            {/* Works Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Works</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-green-600">{stats.published}</div>
                <div className="text-sm text-gray-500">Published</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-blue-600">{stats.manuscript}</div>
                <div className="text-sm text-gray-500">Manuscripts</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-red-600">{stats.lost}</div>
                <div className="text-sm text-gray-500">Lost</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-gray-600">{stats.genres}</div>
                <div className="text-sm text-gray-500">Genres</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <div className="text-2xl font-semibold text-amber-600">{stats.subjects}</div>
                <div className="text-sm text-gray-500">Subject Areas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <WorksFilters />
          </div>

          {/* Works Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Works ({works.length})
                </h2>
                <div className="text-sm text-gray-500">
                  Sorted by composition year (newest first)
                </div>
              </div>
            </div>

            <WorksGrid works={works} />
          </div>
        </div>
      </div>
    </div>
  )
}