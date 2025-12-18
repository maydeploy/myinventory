'use client'

import { useState } from 'react'
import type { FilterState, Category, Brand } from '@/types'

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onClose: () => void
  totalProducts: number
  allBrands: Brand[]
}

const categories: { value: Category; label: string }[] = [
  { value: 'tech', label: 'tech' },
  { value: 'home', label: 'home' },
  { value: 'workspace', label: 'workspace' },
  { value: 'pet', label: 'pet' },
  { value: 'essentials', label: 'essentials' },
  { value: 'wishlist', label: 'wishlist' },
  { value: 'games', label: 'games' },
  { value: 'software', label: 'software' },
]

export default function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  totalProducts,
  allBrands,
}: FilterSidebarProps) {
  const toggleCategory = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const toggleBrand = (brand: Brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    onFiltersChange({ ...filters, brands: newBrands })
  }

  // Get top 5 brands by count
  const brandCounts = allBrands.reduce((acc, brand) => {
    acc[brand] = (acc[brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBrands = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([brand]) => brand as Brand)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink bg-opacity-20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed top-0 left-0 h-screen w-48 bg-paper
          transform transition-transform duration-300 z-30
          overflow-y-auto pt-16 border-r border-border
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 space-y-6">
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-3 text-ink-lighter hover:text-ink transition-colors text-xs font-mono"
            aria-label="Close filters"
          >
            ×
          </button>

          {/* Category filter */}
          <div>
            <h3 className="text-xs font-mono text-ink-lighter mb-3 uppercase tracking-wider">
              Category
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`block w-full text-left px-2 py-1 text-xs font-mono transition-colors ${
                    filters.categories.includes(cat.value)
                      ? 'text-ink bg-paper-dark'
                      : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {filters.categories.includes(cat.value) ? '• ' : '  '}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand filter - top 5 only */}
          {topBrands.length > 0 && (
            <div>
              <h3 className="text-xs font-mono text-ink-lighter mb-3 uppercase tracking-wider">
                Brand
              </h3>
              <div className="space-y-2">
                {topBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`block w-full text-left px-2 py-1 text-xs font-mono transition-colors ${
                      filters.brands.includes(brand)
                        ? 'text-ink bg-paper-dark'
                        : 'text-ink-light hover:text-ink'
                    }`}
                  >
                    {filters.brands.includes(brand) ? '• ' : '  '}
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  )
}
