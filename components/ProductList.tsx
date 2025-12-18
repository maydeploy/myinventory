'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { ImageFxSettings, Product } from '@/types'
import { ditherImageToDataUrl } from '@/lib/dither'

interface ProductListProps {
  products: Product[]
  imageFx: ImageFxSettings
  onProductClick: (product: Product) => void
}

export default function ProductList({ products, imageFx, onProductClick }: ProductListProps) {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductListItem
          key={product.id}
          product={product}
          imageFx={imageFx}
          onClick={() => onProductClick(product)}
          index={index}
        />
      ))}
    </div>
  )
}

function ProductListItem({
  product,
  imageFx,
  onClick,
  index,
}: {
  product: Product
  imageFx: ImageFxSettings
  onClick: () => void
  index: number
}) {
  const [ditheredImage, setDitheredImage] = useState<string>('')
  const [hovered, setHovered] = useState(false)
  const lastKeyRef = useRef<string>('')

  const ditherKey = useMemo(() => {
    return JSON.stringify({
      src: product.coverImage || '',
      contrast: imageFx.contrast,
      bias: imageFx.bias,
      saturation: imageFx.saturation,
      // Small canvas used for the list thumbnail
      size: 80,
    })
  }, [product.coverImage, imageFx.contrast, imageFx.bias, imageFx.saturation])

  const ensureDithered = async () => {
    if (!product.coverImage) return
    if (ditheredImage && lastKeyRef.current === ditherKey) return

    lastKeyRef.current = ditherKey
    try {
      // Generate full dither, then let CSS fit it into 48px thumbnail.
      const url = await ditherImageToDataUrl(product.coverImage, {
        contrast: imageFx.contrast,
        bias: imageFx.bias,
        saturation: imageFx.saturation,
      })
      setDitheredImage(url)
    } catch (e) {
      console.error(e)
    }
  }

  const isWishlist = product.category === 'wishlist'
  const formattedDate = new Date(product.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const handleClick = () => {
    if (product.url) {
      window.open(product.url, '_blank')
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => {
        setHovered(true)
        if (imageFx.ditherOnHover) void ensureDithered()
      }}
      onMouseLeave={() => setHovered(false)}
      className={`
        w-full flex items-center gap-3 p-3 relative group
        border-b border-border hover:bg-paper-dark transition-all
        ${index % 2 === 0 ? 'bg-white' : 'bg-paper'}
        ${product.url ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Sticky Note on Hover */}
      {product.note && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-[#FFF9C4] shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 origin-center transform scale-90 group-hover:scale-100 rotate-2"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div className="flex flex-col justify-between min-h-28 text-xs font-mono text-ink">
            <div className="text-[10px] leading-tight line-clamp-8">
              {product.note}
            </div>

            <div className="pt-2 text-ink-lighter text-[10px] text-left">
              {formattedDate}
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative w-12 h-12 flex-shrink-0 border border-border flex items-center justify-center">
        {product.coverImage ? (
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            className="object-contain opacity-60"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg text-ink-lighter">
            [ ]
          </div>
        )}

        {imageFx.ditherOnHover && ditheredImage && (
          <img
            src={ditheredImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity"
            style={{ opacity: hovered ? imageFx.ditherOpacity : 0 }}
          />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm truncate text-ink">
          {product.name}
        </p>
      </div>

      {/* Brand */}
      <div className="w-24 hidden md:block">
        <span className="text-xs text-ink-lighter font-mono">
          {product.brand}
        </span>
      </div>

      {/* Category */}
      <div className="w-20 hidden lg:block">
        <span className="text-xs text-ink-lighter font-mono">{product.category}</span>
      </div>

      {/* Price */}
      <div className="w-20 text-right">
        <span className="font-mono text-sm text-ink">${product.price.toFixed(2)}</span>
      </div>

      {isWishlist && (
        <span className="text-ink-lighter text-xs">*</span>
      )}
    </div>
  )
}
