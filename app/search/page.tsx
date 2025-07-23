'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/search/search-bar'
import { AdvancedSearch } from '@/components/search/advanced-search'
import { ScholarCard } from '@/components/scholar/scholar-card'
import { searchScholars } from '@/lib/services/search'
import type { SearchResult, SearchFilters } from '@/lib/types'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)
  const [filters, setFilters] = useState<SearchFilters>({})

  useEffect(() => {
    if (query) {
      handleSearch(query, {})
    }
  }, [query])

  const handleSearch = async (searchTerm: string, searchFilters: SearchFilters = {}) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResults = await searchScholars(searchTerm, { 
        limit: 50, 
        ...searchFilters 
      })
      setResults(searchResults)
      setFilters(searchFilters)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (newQuery: string) => {
    setSearchQuery(newQuery)
    if (newQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`)
    }
  }

  const handleClearSearch = () => {
    setResults([])
    setFilters({})
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <AdvancedSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            initialQuery={query}
            initialFilters={filters}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              Searching scholars...
            </div>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No scholars found</h2>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any scholars matching &quot;{query}&quot;. Try searching with different terms or check your spelling.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Try searching for:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => handleNewSearch('Ibrahim')}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Ibrahim
                  </button>
                  <button 
                    onClick={() => handleNewSearch('Harar')}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Harar
                  </button>
                  <button 
                    onClick={() => handleNewSearch('Fiqh')}
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Fiqh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-600 mt-1">
                Found {results.length} scholars matching &quot;{query}&quot;
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <ScholarCard
                  key={result.scholar.id}
                  scholar={result.scholar}
                  highlighted_fields={result.highlighted_fields}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !query && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Start Your Search
            </h2>
            <p className="text-gray-600">
              Search for scholars by name, location, or area of expertise
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}