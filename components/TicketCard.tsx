'use client'

import Image from 'next/image'
import type { Product } from '@/types'

interface TicketCardProps {
  product: Product
  onClick: () => void
}

export default function TicketCard({ product, onClick }: TicketCardProps) {
  const imageSrc = product.coverImage || product.darkModeCoverImage

  // Parse note for movie/TV series metadata
  const note = product.note || ''
  
  // Extract genre (look for "genre:", "Genre:", or similar patterns)
  const genreMatch = note.match(/(?:genre|Genre|GENRE)[:\s]+([^\n,]+)/i)
  const genre = genreMatch ? genreMatch[1].trim() : 'Drama'
  
  // Extract director (look for "director:", "Director:", or similar patterns)
  const directorMatch = note.match(/(?:director|Director|DIRECTOR)[:\s]+([^\n,]+)/i)
  const director = directorMatch ? directorMatch[1].trim() : 'Unknown'
  
  // Determine if it's a movie or TV series (look for "tv", "series", "season", "episodes" in note or name)
  const isTVSeries = /(?:tv|series|season|episodes|ep\.|s\d+e\d+)/i.test(note + ' ' + product.name)
  const mediaType = isTVSeries ? 'TV SERIES' : 'MOVIE'
  
  // Extract length/runtime
  // For movies: look for "Xh Ym", "X hours Y minutes", "X:YY", etc.
  // For TV series: look for "X episodes", "X seasons", etc.
  let length = 'N/A'
  if (isTVSeries) {
    const episodesMatch = note.match(/(\d+)\s*(?:episodes|eps|ep\.)/i)
    const seasonsMatch = note.match(/(\d+)\s*(?:seasons|s\.)/i)
    if (episodesMatch) {
      length = `${episodesMatch[1]} episodes`
    } else if (seasonsMatch) {
      length = `${seasonsMatch[1]} seasons`
    } else {
      length = 'Ongoing'
    }
  } else {
    // Movie runtime
    const runtimeMatch = note.match(/(?:runtime|length|duration)[:\s]+(\d+)\s*(?:h|hours?|:)?\s*(\d+)?\s*(?:m|mins?|minutes?)?/i) ||
                        note.match(/(\d+)\s*(?:h|hours?|:)\s*(\d+)?\s*(?:m|mins?|minutes?)/i) ||
                        note.match(/(\d+):(\d+)/)
    if (runtimeMatch) {
      const hours = parseInt(runtimeMatch[1]) || 0
      const mins = parseInt(runtimeMatch[2]) || 0
      if (hours > 0 && mins > 0) {
        length = `${hours}h ${mins}m`
      } else if (hours > 0) {
        length = `${hours}h`
      } else if (mins > 0) {
        length = `${mins}m`
      }
    } else {
      length = 'N/A'
    }
  }

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1a1a1a] border border-[#333] hover:border-[#ff6b35] transition-all cursor-pointer overflow-hidden flex flex-col h-full"
      style={{
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
      }}
    >
      {/* Perforated edge pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex items-center justify-center gap-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-[#333]"
            style={{ marginLeft: i === 0 ? '0' : '2px' }}
          />
        ))}
      </div>

      {/* Header Image with blur overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover blur-sm scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]" />
        )}
        
        {/* Movie Title - Large Orange Text */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-[#ff6b35] uppercase tracking-tight text-center leading-tight drop-shadow-lg">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Ticket Details Section */}
      <div className="flex-1 p-4 pb-6">
        {/* Left and Right Columns for Details */}
        <div className="grid grid-cols-2 gap-4 text-xs text-white font-mono">
          {/* Left Column */}
          <div className="space-y-2">
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">GENRE</span>
              <p className="text-white mt-0.5 text-xs">{genre}</p>
            </div>
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">TYPE</span>
              <p className="text-white mt-0.5 text-xs">{mediaType}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2 text-right">
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">DIRECTOR</span>
              <p className="text-white mt-0.5 text-xs">{director}</p>
            </div>
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">LENGTH</span>
              <p className="text-white mt-0.5 text-xs">{length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical edge text (ticket ID) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
        <span className="text-[8px] text-[#333] font-mono tracking-widest">
          {product.id.slice(0, 8).toUpperCase()}
        </span>
      </div>
    </div>
  )
}

