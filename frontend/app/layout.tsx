import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Air Paradis Sentiment Analysis',
  description: 'Analysez le sentiment de vos tweets avec notre IA avancée',
  keywords: ['sentiment analysis', 'AI', 'machine learning', 'tweets', 'Air Paradis'],
  authors: [{ name: 'Thomas Berchet' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
