'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { Product } from '@/types'
import { useIsDarkMode } from '@/lib/useIsDarkMode'
import { isDigitalCategory } from '@/lib/categories'
import ReceiptNote from './ReceiptNote'

interface ProductDetailProps {
  product: Product
  onClose: () => void
}

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const isDark = useIsDarkMode()
  const imageSrc = (isDark && product.darkModeCoverImage) ? product.darkModeCoverImage : product.coverImage
  const isGameOrSoftware = product.category === 'game' || product.category === 'software'

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

        {/* Receipt */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="receipt-note relative w-full max-w-md bg-white shadow-lg"
          style={{
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
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
            {imageSrc && (
              <div className="relative w-full aspect-square flex items-center justify-center mb-4 overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className={isGameOrSoftware ? 'object-cover' : 'object-contain'}
                  sizes="400px"
                />
              </div>
            )}

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
              <div className="pt-3">
                <ReceiptNote note={product.note} date={product.date} />
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
