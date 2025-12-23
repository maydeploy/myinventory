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
      {/* Light Switch Toggle - top left */}
      <div className="fixed top-6 left-8 z-50">
        <button
          onClick={toggleTheme}
          className="relative w-14 h-24 bg-paper transition-all font-mono"
          aria-label={isDark ? 'Turn the lights on (light mode)' : 'Turn the lights off (dark mode)'}
          style={{
            background: isDark ? '#0a0a0a' : '#e0e0e0',
            boxShadow: isDark
              ? '0 0 0 3px #00ff00, 0 0 8px rgba(0,255,0,0.3), inset 0 0 20px rgba(0,255,0,0.1)'
              : '0 0 0 3px #333, 0 0 8px rgba(0,0,0,0.2)',
            borderRadius: '2px',
          }}
        >
          {/* Scan line effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isDark
                ? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)'
                : 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
            }}
          />

          {/* Corner brackets - terminal style */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: isDark ? '#00ff00' : '#333' }} />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: isDark ? '#00ff00' : '#333' }} />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: isDark ? '#00ff00' : '#333' }} />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: isDark ? '#00ff00' : '#333' }} />

          {/* Switch plate */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Switch lever */}
            <div
              className="w-6 h-14 transition-all duration-300 ease-out relative"
              style={{
                background: isDark ? '#00ff00' : '#333',
                transform: isDark ? 'translateY(10px)' : 'translateY(-10px)',
                boxShadow: isDark
                  ? '0 0 10px rgba(0,255,0,0.5), inset 0 0 5px rgba(0,255,0,0.3)'
                  : '0 2px 4px rgba(0,0,0,0.3)',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 10%, 100% 90%, 80% 100%, 20% 100%, 0% 90%, 0% 10%)',
              }}
            >
              {/* Pixel detail lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px]" style={{ background: isDark ? '#003300' : '#666', transform: 'translateY(-1px)' }} />
              <div className="absolute top-1/2 left-0 right-0 h-[2px]" style={{ background: isDark ? '#003300' : '#666', transform: 'translateY(1px)' }} />
            </div>
          </div>

          {/* Label with terminal brackets */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <span className="text-[9px] font-mono font-bold" style={{ color: isDark ? '#00ff00' : '#333', textShadow: isDark ? '0 0 5px rgba(0,255,0,0.5)' : 'none' }}>
              [{isDark ? 'OFF' : 'ON_'}]
            </span>
          </div>

          {/* Blinking cursor when ON */}
          {!isDark && (
            <div className="absolute -bottom-6 left-1/2 transform translate-x-2 whitespace-nowrap">
              <span className="text-[9px] font-mono font-bold animate-pulse" style={{ color: '#333' }}>
                _
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Left vertical title panel - always visible, ends 24px above search bar */}
      <div
        className="fixed left-0 top-0 bottom-[calc(4.5rem+24px)] z-40 w-24 border-r border-border flex items-end justify-center pb-6"
        style={{
          boxSizing: 'content-box',
          background: 'unset',
        }}
      >
        <div
          className="font-display text-ink leading-tight whitespace-nowrap select-none"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center center',
            fontSize: '24px',
            textAlign: 'left',
            verticalAlign: 'middle',
            paddingRight: '0px',
            paddingLeft: '180px',
          }}
        >
          <span className="font-bold">GOOD </span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => onInventoryModeChange('physical')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('physical')
            }}
            className={`font-bold cursor-pointer transition-opacity duration-300 ${
              inventoryMode === 'physical' ? 'opacity-100' : 'opacity-40'
            }`}
            aria-label="Show physical categories"
          >
            PHYSICAL
          </span>
          <span className="font-bold opacity-100">/</span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => onInventoryModeChange('digital')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('digital')
            }}
            className={`font-bold cursor-pointer transition-opacity duration-300 ${
              inventoryMode === 'digital' ? 'opacity-100' : 'opacity-40'
            }`}
            aria-label="Show digital categories"
          >
            DIGITAL
          </span>
          <span className="font-bold"> THINGS</span>
        </div>
      </div>

      {/* Bottom Command Line (search bar) - full width */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-paper border-t border-border">
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
