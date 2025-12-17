'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductDetailProps {
  product: Product
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const isWishlist = product.category === 'wishlist'
  const formattedDate = new Date(product.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center md:items-start md:justify-end p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-30"
        />

        {/* Sticky Note */}
        <motion.div
          initial={{ x: '100%', rotate: 2 }}
          animate={{ x: 0, rotate: -1 }}
          exit={{ x: '100%', rotate: 2 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full md:w-[400px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#FFFACD] to-[#FFF8DC] border-2 border-tan shadow-2xl"
          style={{
            marginTop: '20px',
            marginRight: '20px',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-br from-[#FFFACD] to-[#FFF8DC] border-b-2 border-tan p-4 flex items-start justify-between">
            <h2 className="font-bold text-xl pr-8">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-medium hover:text-orange transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image */}
            <div className="relative w-full aspect-[4/3] bg-gray-light border-2 border-tan overflow-hidden">
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
                  sizes="400px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  📦
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-bold">Brand:</span>
                <span className="px-2 py-1 text-sm bg-orange-light border border-orange">
                  {product.brand}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Category:</span>
                <span className="px-2 py-1 text-sm bg-gray-light border border-gray-medium">
                  {product.category}
                </span>
                {isWishlist && <span className="text-xl">⭐</span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Price:</span>
                <span className="text-3xl font-bold text-orange">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">Added:</span>
                <span className="text-sm text-gray-medium">{formattedDate}</span>
              </div>
            </div>

            {/* Notes */}
            {product.note && (
              <div className="space-y-2">
                <h3 className="font-bold">May's Notes:</h3>
                <div className="p-4 bg-white bg-opacity-50 border-l-4 border-orange">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {product.note}
                  </p>
                </div>
              </div>
            )}

            {/* CTA Button */}
            {product.url && (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-orange text-white text-center font-bold hover:bg-opacity-90 transition-all hover:scale-105"
              >
                View Product →
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
