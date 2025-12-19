'use client'

import Image from 'next/image'
import type { Product } from '@/types'

interface TicketCardProps {
  product: Product
  onClick: () => void
}

export default function TicketCard({ product, onClick }: TicketCardProps) {
  const formattedDate = new Date(product.date || product.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const imageSrc = product.coverImage || product.darkModeCoverImage

  // Extract time/theatre info from note if available, or use defaults
  const noteParts = product.note?.split(/[,\n]/) || []
  const timeMatch = product.note?.match(/(\d{1,2}(:\d{2})?\s*(AM|PM|am|pm))/i)
  const time = timeMatch ? timeMatch[1] : '8PM'
  const theatre = product.category || '1'
  const seats = product.id.slice(-3).toUpperCase() || 'A24'

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
      <div className="flex-1 p-4 space-y-3">
        {/* Left and Right Columns for Details */}
        <div className="grid grid-cols-2 gap-4 text-xs text-white font-mono">
          {/* Left Column */}
          <div className="space-y-2">
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">DATE</span>
              <p className="text-white mt-0.5 text-xs">{formattedDate}</p>
            </div>
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">LOCATION</span>
              <p className="text-white mt-0.5 text-xs">{product.brand || 'Digital Theatre'}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2 text-right">
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">TIME</span>
              <p className="text-white mt-0.5 text-xs">{time}</p>
            </div>
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">THEATRE</span>
              <p className="text-white mt-0.5 text-xs">{theatre}</p>
            </div>
            <div>
              <span className="text-[#888] uppercase tracking-wider text-[10px]">SEATS</span>
              <p className="text-white mt-0.5 text-xs">{seats}</p>
            </div>
          </div>
        </div>

        {/* QR Code and Instruction */}
        <div className="flex items-start gap-3 pt-3 border-t border-[#333]">
          {/* QR Code Placeholder - Orange border, white interior */}
          <div className="flex-shrink-0 w-16 h-16 bg-[#ff6b35] p-1">
            <div className="w-full h-full bg-white grid grid-cols-8 gap-0.5 p-0.5">
              {Array.from({ length: 64 }).map((_, i) => {
                // Simple QR-like pattern
                const shouldFill = (i % 9 < 3) || (i % 7 === 0) || (i > 50) || (i < 8) || (i % 8 === 0)
                return (
                  <div
                    key={i}
                    className={`aspect-square ${shouldFill ? 'bg-black' : 'bg-white'}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Instruction Text */}
          <div className="flex-1 text-[10px] text-[#888] leading-relaxed pt-1">
            Please make sure to present your digital ticket to the appropriate gate/access at the theatre.
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

