import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-medium text-gray-700 mb-6">Scholar Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The scholar you&apos;re looking for doesn&apos;t exist in our database. 
          They may have been removed or the link may be incorrect.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Search
        </Link>
      </div>
    </div>
  )
}