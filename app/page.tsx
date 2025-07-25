'use client'

import * as React from 'react'
import { SearchBar } from '@/components/search/search-bar'
import { PremiumCard, FeatureCard, ScholarSearchIcon, TimelineIcon, NetworkIcon, MapIcon } from '@/components/ui/premium-card'
import { StatisticsGrid } from '@/components/ui/statistics-grid'
import { Button, GoldButton, NavyButton } from '@/components/ui/button'
import { fonts } from '@/lib/fonts'
import Link from 'next/link'
import { BookOpen, Users, Globe, Clock, ArrowRight, Sparkles } from 'lucide-react'

// Import motion components individually to avoid export * issues
import { motion } from 'framer-motion'

// Statistics data for the Horn Scholars platform
const statisticsData = [
  {
    value: 600,
    suffix: '+',
    label: 'Years of Scholarship',
    description: 'Centuries of Islamic intellectual tradition',
    color: 'blue' as const,
    icon: <Clock className="w-6 h-6" />,
    trend: 'stable' as const
  },
  {
    value: 312,
    label: 'Verified Scholars',
    description: 'Documented scholarly biographies',
    color: 'purple' as const,
    icon: <Users className="w-6 h-6" />,
    trend: 'up' as const,
    trendValue: '+15 this year'
  },
  {
    value: 3,
    label: 'Languages Supported',
    description: 'Arabic, English, and Somali',
    color: 'green' as const,
    icon: <Globe className="w-6 h-6" />,
    trend: 'stable' as const
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 pattern-manuscript">
      {/* Premium Navigation */}
      <header className="absolute inset-x-0 top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <nav className="container-premium flex items-center justify-between py-4" aria-label="Global">
          <motion.div 
            className="flex lg:flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className={`-m-1.5 p-1.5 ${fonts.display.className} text-2xl font-black tracking-tight text-gray-900 hover:text-blue-600 transition-colors duration-200`}
            >
              Horn Scholars
            </Link>
          </motion.div>
          
          <motion.div 
            className="hidden md:flex gap-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {[
              { href: '/scholars', label: 'Scholars' },
              { href: '/timeline', label: 'Timeline' },
              { href: '/network', label: 'Network' },
              { href: '/map', label: 'Map' },
              { href: '/works', label: 'Works' }
            ].map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </motion.div>
        </nav>
      </header>

      {/* Premium Hero Section - Centered Layout */}
      <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 overflow-hidden min-h-screen flex items-center">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/30 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 pattern-geometric-subtle pointer-events-none" />

        <div className="container-premium relative w-full">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column - Main Content */}
            <motion.div 
              className="lg:col-span-7 space-y-6 lg:-mt-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200/50">
                  <Sparkles className="w-4 h-4" />
                  Digital Archive of Islamic Scholarship
                </div>
              </motion.div>

              {/* Main Heading - Asymmetrical */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className={`${fonts.display.className} text-display leading-none text-gray-900`}>
                  <span className="block">Horn of Africa</span>
                  <span className="block text-blue-600">Islamic Scholars</span>
                  <span className="block text-4xl lg:text-5xl font-medium text-gray-600 mt-2">
                    600+ Years of Wisdom
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-body-large text-gray-700 max-w-2xl leading-relaxed">
                  Discover the remarkable scholars who shaped Islamic intellectual tradition 
                  across the Horn of Africa. Explore their profound teachings, scholarly networks, 
                  and lasting contributions to Islamic jurisprudence, theology, and literature.
                </p>
              </motion.div>

              {/* Premium Search - With Proper Spacing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative pt-6"
              >
                <SearchBar 
                  variant="hero" 
                  premium={true}
                  placeholder="Search scholars, locations, specializations..."
                />
              </motion.div>

              {/* CTA Buttons - Positioned at bottom */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link href="/scholars">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Scholars
                  </Button>
                </Link>
                <Link href="/timeline">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    View Timeline
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Statistics */}
            <motion.div 
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            >
              {/* Premium Statistics Grid */}
              <div className="space-y-4">
                <motion.h3 
                  className="text-heading-3 text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Research Database
                </motion.h3>
                <StatisticsGrid 
                  statistics={statisticsData}
                  variant="premium"
                  columns={1}
                  animated={true}
                  staggerDelay={0.1}
                  className="gap-4"
                />
              </div>


            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Features Section - Optimized Spacing */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-white pattern-octagonal">
        <div className="container-premium">
          
          {/* Section Header - Compact */}
          <motion.div 
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200/50 mb-6">
                <BookOpen className="w-4 h-4" />
                Explore Our Platform
              </div>
            </motion.div>
            
            <h2 className={`${fonts.display.className} text-heading-1 text-gray-900 mb-6`}>
              Discover Scholarly Legacies
            </h2>
            <p className="text-body-large text-gray-700 leading-relaxed">
              Immerse yourself in centuries of Islamic intellectual tradition. 
              Our comprehensive platform connects you with the profound wisdom 
              of Horn of Africa scholars through innovative digital experiences.
            </p>
          </motion.div>

          {/* Premium Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Scholar Discovery Feature */}
            <FeatureCard
              icon={<ScholarSearchIcon className="w-8 h-8" />}
              title="Scholar Discovery"
              description="Advanced search across multilingual archives with intelligent filtering by specialization, era, and geographic region."
              color="blue"
              delay={0.1}
              className="hover:shadow-premium-hover"
            >
              <Link href="/scholars">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full group"
                  rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                >
                  Explore Scholars
                </Button>
              </Link>
            </FeatureCard>

            {/* Timeline Feature */}
            <FeatureCard
              icon={<TimelineIcon className="w-8 h-8" />}
              title="Historical Timeline"
              description="Interactive chronological journey through six centuries of Islamic scholarship and intellectual development."
              color="purple"
              delay={0.2}
            >
              <Link href="/timeline">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full group"
                  rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                >
                  View Timeline
                </Button>
              </Link>
            </FeatureCard>

            {/* Network Feature */}
            <FeatureCard
              icon={<NetworkIcon className="w-8 h-8" />}
              title="Scholarly Networks"
              description="Visualize teacher-student relationships and intellectual connections that shaped Islamic knowledge transmission."
              color="orange"
              delay={0.3}
            >
              <Link href="/network">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full group"
                  rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                >
                  View Network
                </Button>
              </Link>
            </FeatureCard>

            {/* Geographic Map Feature */}
            <FeatureCard
              icon={<MapIcon className="w-8 h-8" />}
              title="Geographic Mapping"
              description="Explore the physical journeys of scholars and discover the centers of learning across the Horn of Africa."
              color="green"
              delay={0.4}
            >
              <Link href="/map">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 w-full group"
                  rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                >
                  Explore Map
                </Button>
              </Link>
            </FeatureCard>
          </div>

          {/* Call to Action Section - Compact */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="glass-light rounded-3xl p-10 border border-white/20 shadow-premium-medium max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`${fonts.display.className} text-heading-2 text-gray-900`}>
                  Begin Your Scholarly Journey
                </h3>
                
                <p className="text-body-large text-gray-700 max-w-2xl mx-auto">
                  Join researchers, students, and enthusiasts from around the world 
                  in exploring the rich intellectual history of Horn of Africa Islamic scholarship.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/scholars">
                    <Button 
                      size="lg"
                      className="sm:w-auto w-full"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Start Exploring
                    </Button>
                  </Link>
                  <Link href="/works">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="sm:w-auto w-full"
                    >
                      Browse Works
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}