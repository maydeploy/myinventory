import type { Metadata } from 'next'
import './globals.css'
import { otBulbMonoline, ppMondwest, ppNeueBit } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'My Inventory | May\'s Curated Collection',
  description: 'A retro-futuristic showcase of curated tech, home, workspace, essentials, and pet products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${otBulbMonoline.variable} ${ppMondwest.variable} ${ppNeueBit.variable} font-mono bg-beige text-gray-dark antialiased`}
        style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}
      >
        {children}
      </body>
    </html>
  )
}
