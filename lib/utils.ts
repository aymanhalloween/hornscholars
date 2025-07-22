import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScholarName(
  arabicName: string,
  englishName: string,
  somaliName?: string | null
): {
  primary: string
  secondary: string
  arabic: string
} {
  return {
    primary: englishName,
    secondary: somaliName || arabicName,
    arabic: arabicName,
  }
}

export function calculateScholarAge(birthYear?: number | null, deathYear?: number | null) {
  if (!birthYear || !deathYear) return null
  return deathYear - birthYear
}

export function formatCentury(year: number): string {
  const century = Math.ceil(year / 100)
  const suffix = century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th'
  return `${century}${suffix} century`
}

export function fuzzyMatch(query: string, target: string, threshold = 0.6): boolean {
  if (!query || !target) return false
  
  const normalizedQuery = query.toLowerCase().trim()
  const normalizedTarget = target.toLowerCase().trim()
  
  // Exact match
  if (normalizedTarget.includes(normalizedQuery)) return true
  
  // Simple Levenshtein-based similarity
  const distance = levenshteinDistance(normalizedQuery, normalizedTarget)
  const maxLength = Math.max(query.length, target.length)
  const similarity = 1 - distance / maxLength
  
  return similarity >= threshold
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null))

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }

  return matrix[b.length][a.length]
}