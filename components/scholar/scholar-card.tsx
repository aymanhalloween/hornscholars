import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AutoLinkedText } from '@/components/ui/auto-linked-text'
import { formatScholarName, formatCentury } from '@/lib/utils'
import type { Scholar } from '@/lib/types'
import Link from 'next/link'

interface ScholarCardProps {
  scholar: Scholar
  highlighted_fields?: string[]
  className?: string
}

export function ScholarCard({ scholar, highlighted_fields = [], className }: ScholarCardProps) {
  const names = formatScholarName(scholar.name_arabic, scholar.name_english, scholar.name_somali)
  const yearsText = scholar.birth_year && scholar.death_year 
    ? `${scholar.birth_year}–${scholar.death_year}` 
    : scholar.birth_year 
    ? `b. ${scholar.birth_year}` 
    : scholar.death_year 
    ? `d. ${scholar.death_year}` 
    : 'Dates unknown'

  const century = scholar.birth_year ? formatCentury(scholar.birth_year) : null

  return (
    <Link href={`/scholar/${scholar.id}`} className="block">
      <Card className={`card-hover cursor-pointer transition-all duration-200 hover:shadow-md ${className}`}>
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <h3 
              className={`text-lg font-semibold text-gray-900 ${
                highlighted_fields.includes('name_english') ? 'bg-yellow-100' : ''
              }`}
            >
              {names.primary}
            </h3>
            <div className="space-y-1">
              <p 
                className={`text-arabic text-base text-gray-700 ${
                  highlighted_fields.includes('name_arabic') ? 'bg-yellow-100' : ''
                }`}
              >
                {names.arabic}
              </p>
              {names.secondary !== names.arabic && (
                <p 
                  className={`text-sm text-gray-600 ${
                    highlighted_fields.includes('name_somali') ? 'bg-yellow-100' : ''
                  }`}
                >
                  {names.secondary}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Years and Century */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{yearsText}</span>
              {century && (
                <>
                  <span>•</span>
                  <span>{century}</span>
                </>
              )}
            </div>

            {/* Biography Preview */}
            {scholar.biography && (
              <AutoLinkedText 
                className={`text-sm text-gray-700 line-clamp-2 ${
                  highlighted_fields.includes('biography') ? 'bg-yellow-100' : ''
                }`}
                excludeCurrentEntity={scholar.id}
                minLength={0}
                as="p"
              >
                {scholar.biography.length > 120 
                  ? `${scholar.biography.slice(0, 120)}...` 
                  : scholar.biography}
              </AutoLinkedText>
            )}

            {/* Specializations */}
            {scholar.specializations && scholar.specializations.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {scholar.specializations.slice(0, 3).map((specialization, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className={`text-xs ${
                      highlighted_fields.includes('specializations') && 
                      specialization.toLowerCase().includes('fiqh') 
                        ? 'bg-yellow-100' 
                        : ''
                    }`}
                  >
                    {specialization}
                  </Badge>
                ))}
                {scholar.specializations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{scholar.specializations.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Locations Preview */}
            {scholar.locations && scholar.locations.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>
                  {scholar.locations.slice(0, 2).map((loc: any) => loc.name).join(', ')}
                  {scholar.locations.length > 2 && ` +${scholar.locations.length - 2} more`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}