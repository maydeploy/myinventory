'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductListProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductListItem
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
          index={index}
        />
      ))}
    </div>
  )
}

function ProductListItem({
  product,
  onClick,
  index,
}: {
  product: Product
  onClick: () => void
  index: number
}) {
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

      canvas.width = 80
      canvas.height = 80
      ctx.drawImage(img, 0, 0, 80, 80)

      const imageData = ctx.getImageData(0, 0, 80, 80)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11

        if (grayscale > 128) {
          data[i] = 245
          data[i + 1] = 245
          data[i + 2] = 220
        } else {
          data[i] = 255
          data[i + 1] = 140
          data[i + 2] = 66
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setDitheredImage(canvas.toDataURL())
    }
  }, [product.coverImage])

  const isWishlist = product.category === 'wishlist'

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 bg-white
        border-2 ${isWishlist ? 'border-dashed border-orange' : 'border-tan'}
        hover:bg-orange-light transition-colors text-left
        ${index % 2 === 0 ? 'bg-opacity-50' : ''}
      `}
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-light border-2 border-tan">
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
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            📦
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{product.name}</p>
      </div>

      {/* Brand */}
      <div className="w-32 hidden md:block">
        <span className="px-2 py-1 text-xs bg-orange-light border border-orange">
          {product.brand}
        </span>
      </div>

      {/* Category */}
      <div className="w-24 hidden lg:block">
        <span className="text-sm">{product.category}</span>
      </div>

      {/* Price */}
      <div className="w-24 text-right">
        <span className="font-bold text-orange">${product.price.toFixed(2)}</span>
      </div>

      {isWishlist && (
        <span className="text-xl">⭐</span>
      )}
    </button>
  )
}
