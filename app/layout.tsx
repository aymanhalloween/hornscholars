import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-latin',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: 'Horn Scholars - Digital Archive of Somali Islamic Scholarship',
  description:
    'The definitive digital platform documenting 600+ years of Somali Islamic scholarship, featuring scholars from the Horn of Africa with multilingual search and network visualizations.',
  keywords: [
    'Somali scholars',
    'Islamic scholarship',
    'Horn of Africa',
    'digital archive',
    'academic research',
    'genealogy',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansArabic.variable}`}>
      <body className="min-h-screen bg-white">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}