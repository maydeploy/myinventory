'use client'

import { useState } from 'react'
import type { FilterState, Category } from '@/types'

type InventoryMode = 'physical' | 'digital'

interface FilterSidebarProps {
  inventoryMode: InventoryMode
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onClose: () => void
  totalProducts: number
}

const physicalCategories: { value: Category; label: string }[] = [
  { value: 'tech', label: 'tech' },
  { value: 'home', label: 'home' },
  { value: 'essential', label: 'essential' },
  { value: 'wishlist', label: 'wishlist' },
]

const digitalCategories: { value: Category; label: string }[] = [
  { value: 'game', label: 'game' },
  { value: 'software', label: 'software' },
  { value: 'watchlist', label: 'watch list' },
]

export default function FilterSidebar({
  inventoryMode,
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  totalProducts,
}: FilterSidebarProps) {
  const categoryOptions = inventoryMode === 'digital' ? digitalCategories : physicalCategories

  const toggleCategory = (category: Category) => {
    onFiltersChange({ ...filters, category })
  }

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
              <button
                onClick={() => onFiltersChange({ ...filters, category: 'all' })}
                className={`block w-full text-left px-2 py-1 text-xs font-mono transition-colors ${
                  filters.category === 'all'
                    ? 'text-ink bg-paper-dark'
                    : 'text-ink-light hover:text-ink'
                }`}
              >
                {filters.category === 'all' ? '• ' : '  '}
                all
              </button>
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`block w-full text-left px-2 py-1 text-xs font-mono transition-colors ${
                    filters.category === cat.value
                      ? 'text-ink bg-paper-dark'
                      : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {filters.category === cat.value ? '• ' : '  '}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </>
  )
}
