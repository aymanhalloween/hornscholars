'use client'

import React, { useEffect, useState } from 'react'
import { autoLinkText } from '@/lib/utils/auto-linking'

export interface AutoLinkedTextProps {
  children: string
  className?: string
  linkScholars?: boolean
  linkLocations?: boolean
  linkWorks?: boolean
  excludeCurrentEntity?: string
  as?: keyof React.JSX.IntrinsicElements
  minLength?: number // Minimum text length to process (performance optimization)
}

export function AutoLinkedText({
  children,
  className = '',
  linkScholars = true,
  linkLocations = true,
  linkWorks = true,
  excludeCurrentEntity,
  as: Component = 'div',
  minLength = 50
}: AutoLinkedTextProps) {
  const [linkedText, setLinkedText] = useState<string>(children)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Skip processing for very short text
    if (!children || children.length < minLength) {
      setLinkedText(children)
      return
    }

    setIsProcessing(true)
    
    autoLinkText(children, {
      linkScholars,
      linkLocations,
      linkWorks,
      excludeCurrentEntity
    })
      .then(result => {
        setLinkedText(result)
      })
      .catch(error => {
        console.error('Auto-linking error:', error)
        setLinkedText(children) // Fallback to original text
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }, [children, linkScholars, linkLocations, linkWorks, excludeCurrentEntity, minLength])

  // Show loading state for long texts
  if (isProcessing && children.length > 500) {
    return React.createElement(Component, {
      className: `${className} opacity-70`,
    }, children)
  }

  return React.createElement(Component, {
    className,
    dangerouslySetInnerHTML: { __html: linkedText }
  })
}

// Server-side version for static content
export async function StaticAutoLinkedText({
  children,
  className = '',
  linkScholars = true,
  linkLocations = true,
  linkWorks = true,
  excludeCurrentEntity,
  as: Component = 'div'
}: Omit<AutoLinkedTextProps, 'minLength'>) {
  const linkedText = await autoLinkText(children, {
    linkScholars,
    linkLocations,
    linkWorks,
    excludeCurrentEntity
  })

  return React.createElement(Component, {
    className,
    dangerouslySetInnerHTML: { __html: linkedText }
  })
}