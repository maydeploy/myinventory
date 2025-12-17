'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [ditheredImage, setDitheredImage] = useState<string>('')

  useEffect(() => {
    if (!product.coverImage) return

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = product.coverImage

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Simple dithering algorithm
      for (let i = 0; i < data.length; i += 4) {
        const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11

        // Apply threshold with orange/beige tones
        if (grayscale > 128) {
          data[i] = 245     // Beige
          data[i + 1] = 245
          data[i + 2] = 220
        } else {
          data[i] = 255     // Orange
          data[i + 1] = 140
          data[i + 2] = 66
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setDitheredImage(canvas.toDataURL())
    }

    img.onerror = () => {
      console.error('Failed to load image for dithering')
    }
  }, [product.coverImage])

  const isWishlist = product.category === 'wishlist'

  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden bg-white
        transition-all duration-300 hover:scale-105
        ${isWishlist ? 'border-2 border-dashed border-orange' : 'border-2 border-tan'}
        hover:shadow-lg cursor-pointer text-left
      `}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-light overflow-hidden">
        {ditheredImage ? (
          <img
            src={ditheredImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : product.coverImage ? (
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            className="object-cover opacity-50"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-gray-medium">
            📦
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg line-clamp-2 flex-1">
            {product.name}
          </h3>
          {isWishlist && (
            <span className="text-2xl">⭐</span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs bg-orange-light border border-orange">
            {product.brand}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-light border border-gray-medium">
            {product.category}
          </span>
        </div>

        <p className="text-2xl font-bold text-orange">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 border-2 border-orange opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  )
}
