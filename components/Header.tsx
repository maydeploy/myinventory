'use client'

import { useEffect, useState } from 'react'
import type { Category, CategoryFilter, FilterState, SortOption } from '@/types'

type InventoryMode = 'physical' | 'digital'

interface HeaderProps {
  inventoryMode: InventoryMode
  onInventoryModeChange: (mode: InventoryMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
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

export default function Header({
  inventoryMode,
  onInventoryModeChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  filters,
  onFiltersChange,
}: HeaderProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const categoryOptions = inventoryMode === 'digital' ? digitalCategories : physicalCategories

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = stored ? stored === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    window.localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'price-asc', label: 'price: low to high' },
    { value: 'price-desc', label: 'price: high to low' },
    { value: 'name-asc', label: 'name: a-z' },
    { value: 'name-desc', label: 'name: z-a' },
  ]


  const toggleCategory = (category: Category) => {
    onFiltersChange({ ...filters, category })
  }
  const setCategoryFilter = (category: CategoryFilter) => {
    onFiltersChange({ ...filters, category })
  }

  return (
    <>
      {/* Top-left controls (theme + sort + view) */}
      <div className="fixed top-3 left-3 z-50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-all duration-300">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-[10px] sm:text-xs text-ink-light bg-paper"
            aria-label={isDark ? 'Turn the lights on (light mode)' : 'Turn the lights off (dark mode)'}
          >
            {isDark ? '[turn the lights on]' : '[turn the lights off]'}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-[10px] sm:text-xs text-ink-light bg-paper"
            >
              {sortOptions.find(opt => opt.value === sortOption)?.label || 'sort'}
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSortOpen(false)}
                />
                <div className="absolute left-0 mt-1 w-48 bg-paper border border-border shadow-lg z-50">
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

        </div>
      </div>

      {/* Left vertical title panel */}
      <div className="fixed left-0 top-0 bottom-0 z-40 w-24 bg-paper border-r border-border flex items-center justify-center">
        <div
          className="font-display text-ink leading-tight whitespace-nowrap select-none"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center center'
          }}
        >
          <span className="text-[20px] sm:text-[24px] md:text-[32px] font-bold">GRID OF GOOD </span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => onInventoryModeChange('physical')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('physical')
            }}
            className={`text-[20px] sm:text-[24px] md:text-[32px] font-bold cursor-pointer transition-opacity duration-300 ${
              inventoryMode === 'physical' ? 'opacity-100' : 'opacity-40'
            }`}
            aria-label="Show physical categories"
          >
            PHYSICAL
          </span>
          <span className="text-[20px] sm:text-[24px] md:text-[32px] font-bold opacity-100">/</span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => onInventoryModeChange('digital')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('digital')
            }}
            className={`text-[20px] sm:text-[24px] md:text-[32px] font-bold cursor-pointer transition-opacity duration-300 ${
              inventoryMode === 'digital' ? 'opacity-100' : 'opacity-40'
            }`}
            aria-label="Show digital categories"
          >
            DIGITAL
          </span>
          <span className="text-[20px] sm:text-[24px] md:text-[32px] font-bold"> THINGS</span>
        </div>
      </div>

      {/* Bottom Command Line (search bar) */}
      <div className="fixed bottom-0 left-24 right-0 z-40 bg-paper border-t border-border">
        <div className="px-4 py-2 md:px-8">
          <div className="flex flex-col gap-2">
            {/* Filters (below divider, above search) */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] sm:text-xs transition-all duration-300">
              {inventoryMode === 'physical' && (
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2 py-1 transition-colors ${
                    filters.category === 'all'
                      ? 'text-ink bg-paper-dark'
                      : 'text-ink-light hover:text-ink'
                  }`}
                  aria-label="Show all categories"
                >
                  {filters.category === 'all' ? '• ' : '  '}
                  all
                </button>
              )}

              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={`px-2 py-1 transition-colors ${
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

            {/* Search */}
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm transition-all duration-300">
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
                  [clear search]
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
