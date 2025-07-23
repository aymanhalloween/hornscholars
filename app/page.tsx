import { SearchBar } from '@/components/search/search-bar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-gray-900">Horn Scholars</span>
            </Link>
          </div>
          <div className="flex gap-x-6">
            <Link href="/search" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
              Scholars
            </Link>
            <Link href="/timeline" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
              Timeline
            </Link>
            <Link href="/network" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
              Network
            </Link>
            <Link href="/map" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
              Map
            </Link>
            <Link href="/works" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600">
              Works
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
              Horn Scholars
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Discover the remarkable scholars who shaped 600+ years of Islamic
              intellectual tradition in the Horn of Africa. Explore their lives,
              teachings, and lasting contributions to Islamic scholarship.
            </p>
            
            {/* Search Section */}
            <div className="mt-12">
              <SearchBar />
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-6 text-center sm:grid-cols-3">
              <div>
                <div className="text-3xl font-semibold text-gray-900">600+</div>
                <div className="text-sm text-gray-500">Years of Scholarship</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-gray-900">312</div>
                <div className="text-sm text-gray-500">Verified Scholars</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-gray-900">3</div>
                <div className="text-sm text-gray-500">Languages Supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              Discover Scholarly Legacies
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Learn about the scholars who shaped Islamic thought in the Horn of Africa.
              Trace their intellectual journeys, explore their contributions, and
              understand the networks that connected generations of learning.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  Scholar Discovery
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Find scholars by name, specialization, or time period across
                  Arabic, English, and Somali sources.
                </p>
                <Link href="/search">
                  <Button className="mt-4 text-sm">
                    Explore Scholars
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center bg-purple-600 rounded-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  Historical Timeline
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Explore centuries of scholarship through an interactive
                  timeline showing the evolution of Islamic thought.
                </p>
                <Link href="/timeline">
                  <Button className="mt-4 text-sm">
                    View Timeline
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center bg-amber-600 rounded-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  Scholarly Networks
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Discover how knowledge was transmitted through teacher-student
                  relationships and intellectual connections.
                </p>
                <Link href="/network">
                  <Button className="mt-4 text-sm">
                    View Network
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center bg-green-600 rounded-lg">
                  <svg
                    className="h-6 w-6 text-white"
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
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  Geographic Map
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Trace the physical journeys of scholars across the Horn of Africa
                  and discover centers of learning.
                </p>
                <Link href="/map">
                  <Button className="mt-4 text-sm">
                    Explore Map
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}