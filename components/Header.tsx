'use client'

import { useState } from 'react'
import type { Brand, Category, DisplayMode, FilterState, SortOption } from '@/types'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  onFilterToggle: () => void
  filterOpen: boolean
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  allBrands: Brand[]
}

const categories: { value: Category; label: string }[] = [
  { value: 'tech', label: 'tech' },
  { value: 'home', label: 'home' },
  { value: 'workspace', label: 'workspace' },
  { value: 'pet', label: 'pet' },
  { value: 'essentials', label: 'essentials' },
  { value: 'wishlist', label: 'wishlist' },
]

export default function Header({
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  displayMode,
  onDisplayModeChange,
  onFilterToggle,
  filterOpen,
  filters,
  onFiltersChange,
  allBrands,
}: HeaderProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date-desc', label: 'newest first' },
    { value: 'date-asc', label: 'oldest first' },
    { value: 'price-asc', label: 'price: low to high' },
    { value: 'price-desc', label: 'price: high to low' },
    { value: 'name-asc', label: 'name: a-z' },
    { value: 'name-desc', label: 'name: z-a' },
  ]

  const viewOptions: { value: DisplayMode; label: string }[] = [
    { value: 'grid', label: 'grid' },
    { value: 'list', label: 'list' },
    { value: 'stack', label: 'stack' },
    { value: 'shuffle', label: 'shuffle' },
  ]

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

  // Get top 6 brands by count
  const brandCounts = allBrands.reduce((acc, brand) => {
    acc[brand] = (acc[brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBrands = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([brand]) => brand as Brand)

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-paper border-b border-border">
        <div className="px-4 py-3 md:px-8">
          <div className="flex items-center justify-between">
            <h1
              className="font-display text-[36px] font-bold text-ink"
            >
              MY//INVENTORY
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={onFilterToggle}
                className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light"
                aria-label="Toggle filters"
              >
                [filters]
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light"
                >
                  {sortOptions.find(opt => opt.value === sortOption)?.label || 'sort'}
                </button>

                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-paper border border-border shadow-lg z-50">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onSortChange(option.value)
                            setIsSortOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-paper-dark transition-all text-xs ${
                            sortOption === option.value
                              ? 'bg-paper-dark text-ink font-bold'
                              : 'text-ink-light'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Display mode toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsViewOpen(!isViewOpen)}
                  className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light"
                  aria-label="Change view mode"
                >
                  [{viewOptions.find(v => v.value === displayMode)?.label || 'view'}]
                </button>

                {isViewOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsViewOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-40 bg-paper border border-border shadow-lg z-50">
                      {viewOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            onDisplayModeChange(option.value)
                            setIsViewOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-paper-dark transition-all text-xs ${
                            displayMode === option.value
                              ? 'bg-paper-dark text-ink font-bold'
                              : 'text-ink-light'
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
        </div>
      </header>

      {/* Bottom Command Line */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-paper border-t border-border">
        <div className="px-4 py-2 md:px-8">
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-ink-lighter">{'>'}</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="search..."
              className="flex-1 bg-transparent border-none focus:outline-none text-ink placeholder-ink-lighter"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-ink-lighter hover:text-ink transition-colors text-xs"
                aria-label="Clear search"
              >
                [clear]
              </button>
            )}
          </div>

          {filterOpen && (
            <div className="mt-2 pt-2 border-t border-border font-mono text-xs">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <div className="text-ink-lighter uppercase tracking-wider mb-2">category</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={`block w-full text-left px-2 py-1 transition-colors ${
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

                <div>
                  <div className="text-ink-lighter uppercase tracking-wider mb-2">brand</div>
                  {topBrands.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {topBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`block w-full text-left px-2 py-1 transition-colors ${
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
                  ) : (
                    <div className="text-ink-lighter px-2 py-1 italic">no brands</div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
