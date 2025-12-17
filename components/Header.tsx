'use client'

import { useState } from 'react'
import type { DisplayMode, SortOption } from '@/types'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  onFilterToggle: () => void
}

export default function Header({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  displayMode,
  onDisplayModeChange,
  onFilterToggle,
}: HeaderProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date-desc', label: 'Date Added (Newest) ▼' },
    { value: 'date-asc', label: 'Date Added (Oldest) ▲' },
    { value: 'price-asc', label: 'Price (Low to High) ▲' },
    { value: 'price-desc', label: 'Price (High to Low) ▼' },
    { value: 'name-asc', label: 'Name (A-Z) ▲' },
    { value: 'name-desc', label: 'Name (Z-A) ▼' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-beige border-b-2 border-tan">
      <div className="px-4 py-4 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-dark">
            MY_INVENTORY.exe
          </h1>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={onFilterToggle}
              className="lg:hidden px-3 py-2 border-2 border-tan hover:bg-orange-light transition-colors"
              aria-label="Toggle filters"
            >
              ☰
            </button>

            {/* Display mode toggle */}
            <button
              onClick={() => onDisplayModeChange(displayMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-2 border-2 border-tan hover:bg-orange-light transition-colors"
              aria-label={`Switch to ${displayMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {displayMode === 'grid' ? '☰' : '⚏'}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border-2 border-tan bg-white focus:outline-none focus:border-orange transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-medium hover:text-orange"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full md:w-auto px-4 py-2 border-2 border-tan bg-white hover:bg-orange-light transition-colors flex items-center justify-between gap-2"
            >
              <span className="whitespace-nowrap">
                {sortOptions.find(opt => opt.value === sortOption)?.label}
              </span>
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSortOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-tan shadow-lg z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value)
                        setIsSortOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-orange-light transition-colors ${
                        sortOption === option.value ? 'bg-orange-light font-bold' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
