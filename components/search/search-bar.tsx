'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Sparkles, History, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  variant?: 'hero' | 'page' | 'compact'
  showSuggestions?: boolean
  premium?: boolean
}

interface SearchSuggestion {
  text: string
  type: 'scholar' | 'location' | 'specialization' | 'recent'
  icon: React.ReactNode
}

const defaultSuggestions: SearchSuggestion[] = [
  { text: 'Ibrahim', type: 'scholar', icon: <Search className="h-3 w-3" /> },
  { text: 'Harar', type: 'location', icon: <TrendingUp className="h-3 w-3" /> },
  { text: 'Fiqh', type: 'specialization', icon: <Sparkles className="h-3 w-3" /> },
  { text: 'Sufism', type: 'specialization', icon: <Sparkles className="h-3 w-3" /> },
  { text: 'Somalia', type: 'location', icon: <TrendingUp className="h-3 w-3" /> },
  { text: 'Qadiriyya', type: 'specialization', icon: <Sparkles className="h-3 w-3" /> },
]

export function SearchBar({
  placeholder = 'Search scholars by name, location, or specialization...',
  onSearch,
  className,
  variant = 'page',
  showSuggestions = true,
  premium = false,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [suggestions] = React.useState(defaultSuggestions)
  const inputRef = React.useRef<HTMLInputElement>(null)

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
      setShowDropdown(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    if (onSearch) {
      onSearch(suggestion)
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    }
    setShowDropdown(false)
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (showSuggestions && !query) {
      setShowDropdown(true)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay hiding dropdown to allow clicking on suggestions
    setTimeout(() => setShowDropdown(false), 150)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowDropdown(showSuggestions && (value.length > 0 || isFocused))
  }

  // Variant-specific styling
  const getContainerClasses = () => {
    const base = 'relative'
    switch (variant) {
      case 'hero':
        return cn(base, 'w-full max-w-3xl')
      case 'compact':
        return cn(base, 'w-full max-w-md')
      default:
        return cn(base, 'w-full max-w-2xl mx-auto')
    }
  }

  const getInputClasses = () => {
    const base = cn(
      'w-full pl-12 pr-12 py-4 text-base font-medium',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus:ring-0',
      'placeholder:text-gray-500 placeholder:font-normal'
    )
    
    if (premium || variant === 'hero') {
      return cn(
        base,
        'glass-search rounded-2xl border-0',
        'text-gray-800 placeholder:text-gray-600',
        isFocused 
          ? 'bg-white/95 shadow-premium-large scale-[1.02]' 
          : 'bg-white/80 shadow-premium-medium'
      )
    }
    
    return cn(
      base,
      'bg-white border border-gray-200 rounded-xl shadow-premium-subtle',
      isFocused 
        ? 'border-blue-600 shadow-premium-medium ring-2 ring-blue-600/20' 
        : 'hover:border-gray-300'
    )
  }

  const filteredSuggestions = React.useMemo(() => {
    if (!query.trim()) return suggestions
    return suggestions.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, suggestions])

  return (
    <div className={getContainerClasses()}>
      <form onSubmit={handleSearch} className={cn('search-bar relative', className)}>
        {/* Main Search Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
        >
          {/* Search Icon */}
          <motion.div 
            className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10"
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? '#2563eb' : '#6b7280'
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="h-5 w-5" />
          </motion.div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={getInputClasses()}
            autoComplete="search"
            spellCheck={false}
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.div 
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 w-8 p-0 hover:bg-gray-100/80 rounded-full transition-all duration-200"
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Glow Effect */}
          {(premium || variant === 'hero') && isFocused && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        {/* Advanced Suggestions Dropdown */}
        <AnimatePresence>
          {showDropdown && showSuggestions && (
            <motion.div
              className={cn(
                'absolute top-full left-0 right-0 mt-2 z-50',
                premium || variant === 'hero' 
                  ? 'glass-medium rounded-2xl border border-white/20 shadow-premium-large' 
                  : 'bg-white rounded-xl border border-gray-200 shadow-premium-medium'
              )}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.2, 
                ease: [0.4, 0.0, 0.2, 1] 
              }}
            >
              {/* Suggestions Header */}
              {!query && (
                <div className="px-4 py-3 border-b border-gray-100/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    Popular Searches
                  </div>
                </div>
              )}

              {/* Suggestions List */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.text}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={cn(
                        'w-full px-4 py-3 text-left flex items-center gap-3',
                        'hover:bg-gray-50/80 transition-colors duration-150',
                        'focus:outline-none focus:bg-gray-50/80',
                        premium && 'hover:bg-white/20 focus:bg-white/20'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: index * 0.03,
                        ease: [0.4, 0.0, 0.2, 1]
                      }}
                    >
                      <div className={cn(
                        'flex-shrink-0 p-1.5 rounded-lg',
                        suggestion.type === 'scholar' && 'bg-blue-100 text-blue-600',
                        suggestion.type === 'location' && 'bg-green-100 text-green-600',
                        suggestion.type === 'specialization' && 'bg-purple-100 text-purple-600',
                        suggestion.type === 'recent' && 'bg-gray-100 text-gray-600'
                      )}>
                        {suggestion.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {suggestion.type}
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <Search className="h-4 w-4" />
                      </div>
                    </motion.button>
                  ))
                ) : query && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <div className="text-sm">No suggestions found</div>
                    <div className="text-xs mt-1">Try a different search term</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {!query && (
                <div className="px-4 py-3 border-t border-gray-100/50">
                  <div className="text-xs text-gray-500 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">↵</kbd> to search
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Static Suggestions (for non-dropdown variants) */}
      {!showSuggestions && variant !== 'compact' && (
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sm text-gray-500 mb-2">
            Popular searches:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.slice(0, 6).map((suggestion) => (
              <motion.button
                key={suggestion.text}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.text)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full',
                  'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-600/20'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {suggestion.text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}