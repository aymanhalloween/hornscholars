'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function SearchBar({
  placeholder = 'Search scholars by name, location, or specialization...',
  onSearch,
  className,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    
    if (trimmedQuery) {
      // Use custom onSearch handler if provided, otherwise navigate to search page
      if (onSearch) {
        onSearch(trimmedQuery)
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      }
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <form onSubmit={handleSearch} className={cn('search-bar', className)}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Search Input */}
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'search-input pl-10',
            query && 'pr-10',
            isFocused && 'ring-2 ring-blue-600/20 border-blue-600'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Clear Button */}
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-400" />
              <span className="sr-only">Clear search</span>
            </Button>
          </div>
        )}
      </div>

      {/* Search Suggestions/Hints */}
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">
          Try searching for{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
            onClick={() => setQuery('Ibrahim')}
          >
            Ibrahim
          </button>
          {', '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
            onClick={() => setQuery('Harar')}
          >
            Harar
          </button>
          {', or '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 underline"
            onClick={() => setQuery('Fiqh')}
          >
            Fiqh
          </button>
        </p>
      </div>
    </form>
  )
}