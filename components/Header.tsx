'use client'

import { useEffect, useState } from 'react'
import type { Category, CategoryFilter, DisplayMode, FilterState, SortOption } from '@/types'

type InventoryMode = 'physical' | 'digital'

interface HeaderProps {
  inventoryMode: InventoryMode
  onInventoryModeChange: (mode: InventoryMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
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
  displayMode,
  onDisplayModeChange,
  filters,
  onFiltersChange,
}: HeaderProps) {
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
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
    onFiltersChange({ ...filters, category })
  }
  const setCategoryFilter = (category: CategoryFilter) => {
    onFiltersChange({ ...filters, category })
  }

  return (
    <>
      {/* Top-left controls (theme + sort + view) */}
      <div className="fixed top-3 left-3 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light bg-paper"
            aria-label={isDark ? 'Turn the lights on (light mode)' : 'Turn the lights off (dark mode)'}
          >
            {isDark ? '[turn the lights on]' : '[turn the lights off]'}
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light bg-paper"
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

          {/* Display mode toggle */}
          <div className="relative">
            <button
              onClick={() => setIsViewOpen(!isViewOpen)}
              className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light bg-paper"
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
                <div className="absolute left-0 mt-1 w-40 bg-paper border border-border shadow-lg z-50">
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

      {/* Bottom-left title block (sits ABOVE the divider line) */}
      <div className="fixed left-0 right-0 bottom-16 z-40 align-middle">
        <div className="px-4 py-2 md:px-8 align-middle">
          <div className="flex items-start justify-between gap-0 align-middle">
            <div className="font-display text-ink leading-[0.95] text-left inline-block align-middle mb-0">
              <div className="text-[36px] md:text-[44px] font-bold h-[34px] leading-[34px] align-middle">
                GRID OF
              </div>
              <div className="text-[36px] md:text-[44px] font-bold h-[34px] leading-[34px] align-middle">
                GOOD
              </div>
              <div className="text-[36px] md:text-[44px] font-bold select-none h-[34px] leading-[34px] align-middle">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => onInventoryModeChange('physical')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('physical')
                  }}
                  className={`cursor-pointer transition-opacity ${
                    inventoryMode === 'physical' ? 'opacity-100' : 'opacity-40'
                  }`}
                  aria-label="Show physical categories"
                >
                  PHYSICAL
                </span>
                <span className="opacity-100">{"/"}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => onInventoryModeChange('digital')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('digital')
                  }}
                  className={`cursor-pointer transition-opacity ${
                    inventoryMode === 'digital' ? 'opacity-100' : 'opacity-40'
                  }`}
                  aria-label="Show digital categories"
                >
                  DIGITAL
                </span>
              </div>
              <div className="text-[36px] md:text-[44px] font-bold h-[34px] leading-[34px] align-middle">
                THINGS
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Command Line (search bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-paper border-t border-border">
        <div className="px-4 py-2 md:px-8">
          <div className="flex flex-col gap-2">
            {/* Filters (below divider, above search) */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs">
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
