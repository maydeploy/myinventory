'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Product } from '@/types'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import { isDigitalCategory } from '@/lib/categories'

interface ProductDetailProps {
  product: Product
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [ditheredImage, setDitheredImage] = useState<string>('')
  const isDark = useIsDarkMode()
  const imageSrc = (isDark && product.darkModeCoverImage) ? product.darkModeCoverImage : product.coverImage

  useEffect(() => {
    setDitheredImage('')
    if (!imageSrc) return

    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

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
          data[i] = 26
          data[i + 1] = 26
          data[i + 2] = 26
        } else {
          data[i] = 0
          data[i + 1] = 255
          data[i + 2] = 65
        }
      }

      ctx.putImageData(imageData, 0, 0)
      setDitheredImage(canvas.toDataURL())
    }
  }, [imageSrc])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const isWishlist = product.category === 'wishlist'
  const isDigital = isDigitalCategory(product.category)
  const formattedDate = new Date(product.createdTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink bg-opacity-20"
        />

        {/* Sticky Note */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="sticky-note relative w-full max-w-md bg-[#FFF9C4] shadow-lg"
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-ink-light hover:text-ink transition-colors text-lg"
            aria-label="Close"
          >
            ×
          </button>

          <div className="p-6 space-y-4">
            {/* Image */}
            {ditheredImage || imageSrc ? (
              <div className="relative w-full aspect-square flex items-center justify-center mb-4">
                {ditheredImage ? (
                  <img
                    src={ditheredImage}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="400px"
                  />
                ) : null}
              </div>
            ) : null}

            {/* Title */}
            <h2 className="text-xl font-mono text-ink leading-tight">
              {product.name}
            </h2>

            {/* Metadata */}
            <div className="space-y-2 text-sm font-mono text-ink-light">
              {product.brand && (
                <div>
                  <span className="text-ink-lighter">brand:</span> {product.brand}
                </div>
              )}
              <div>
                <span className="text-ink-lighter">category:</span> {product.category}
              </div>
              {!isDigital && (
                <div>
                  <span className="text-ink-lighter">price:</span> <span className="text-ink font-bold">${product.price.toFixed(2)}</span>
                </div>
              )}
              <div>
                <span className="text-ink-lighter">added:</span> {formattedDate}
              </div>
              {isWishlist && (
                <div className="text-ink">
                  * wishlist item
                </div>
              )}
            </div>

            {/* Notes */}
            {product.note && (
              <div className="pt-3 border-t border-ink border-opacity-20">
                <p className="text-sm font-mono text-ink leading-relaxed whitespace-pre-wrap">
                  {product.note}
                </p>
              </div>
            )}

            {/* Link */}
            {product.url && (
              <div className="pt-3">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-accent hover:text-accent-dark underline transition-colors"
                >
                  view product →
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
