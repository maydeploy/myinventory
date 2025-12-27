'use client'

import { useEffect, useState, useRef } from 'react'
import { flushSync } from 'react-dom'
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
  const switchRef = useRef<HTMLButtonElement>(null)
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

  const toggleTheme = async () => {
    const next = !isDark

    // Fallback for unsupported browsers or reduced-motion preference
    if (
      !switchRef.current ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsDark(next)
      document.documentElement.classList.toggle('dark', next)
      window.localStorage.setItem('theme', next ? 'dark' : 'light')
      return
    }

    try {
      // Start transition and await pseudo-elements attachment
      await document.startViewTransition(() => {
        flushSync(() => {
          setIsDark(next)
          document.documentElement.classList.toggle('dark', next)
          window.localStorage.setItem('theme', next ? 'dark' : 'light')
        })
      }).ready

      // Calculate circle origin and radius from the switch button
      const { top, left, width, height } = switchRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const right = window.innerWidth - left
      const bottom = window.innerHeight - top
      const maxRadius = Math.hypot(
        Math.max(left, right),
        Math.max(top, bottom)
      )

      // Animate clip-path on new state
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    } catch (error) {
      // Fallback if view transition fails
      console.error('View transition failed:', error)
      setIsDark(next)
      document.documentElement.classList.toggle('dark', next)
      window.localStorage.setItem('theme', next ? 'dark' : 'light')
    }
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
      <div className="fixed top-6 left-8 z-[100002]">
        <button
          ref={switchRef}
          onClick={toggleTheme}
          className="relative w-9 h-16 bg-paper border-2 border-border rounded-md shadow-md transition-all hover:shadow-lg cursor-pointer"
          aria-label={isDark ? 'Turn the lights on (light mode)' : 'Turn the lights off (dark mode)'}
          style={{
            background: isDark ? '#1a1a1a' : '#f5f5f5',
          }}
        >
          {/* Switch plate */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Switch lever */}
            <div
              className="w-5 h-9 rounded-sm transition-all duration-300 ease-out"
              style={{
                background: isDark
                  ? 'linear-gradient(to right, #333 0%, #555 50%, #333 100%)'
                  : 'linear-gradient(to right, #ddd 0%, #fff 50%, #ddd 100%)',
                transform: isDark ? 'translateY(6px)' : 'translateY(-6px)',
                boxShadow: isDark
                  ? '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'
                  : '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.5)',
              }}
            >
              {/* Switch knob */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-5 rounded-sm"
                style={{
                  background: isDark ? '#222' : '#ccc',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </div>

          {/* Label */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
            <span className="text-[8px] text-ink-lighter font-mono">
              {isDark ? 'OFF' : 'ON'}
            </span>
          </div>
        </button>
      </div>

      {/* Left vertical title panel - visible on smaller screens, hidden on xl+ */}
      <div
        className="xl:hidden fixed left-0 top-0 bottom-[calc(4.5rem+24px)] z-[100001] w-24 flex items-end justify-center pb-6"
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

      {/* Large horizontal title - shown in bottom left on xl+ screens */}
      <div className="hidden xl:flex fixed left-8 bottom-[calc(4.5rem+24px+1.5rem)] z-[100001] flex-col items-start gap-0 select-none">
        <h1 className="font-display font-bold text-ink text-6xl leading-[0.7] tracking-normal">
          GOOD
        </h1>
        <div className="font-display font-bold text-6xl leading-[0.7] tracking-normal">
          <span
            role="button"
            tabIndex={0}
            onClick={() => onInventoryModeChange('physical')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('physical')
            }}
            className={`cursor-pointer transition-opacity duration-300 tracking-normal ${
              inventoryMode === 'physical' ? 'text-ink opacity-100' : 'text-ink opacity-40'
            }`}
            aria-label="Show physical categories"
          >
            PHYSICAL
          </span>
          <span className="text-ink opacity-100 tracking-normal">/</span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => onInventoryModeChange('digital')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInventoryModeChange('digital')
            }}
            className={`cursor-pointer transition-opacity duration-300 tracking-normal ${
              inventoryMode === 'digital' ? 'text-ink opacity-100' : 'text-ink opacity-40'
            }`}
            aria-label="Show digital categories"
          >
            DIGITAL
          </span>
        </div>
        <h1 className="font-display font-bold text-ink text-6xl leading-[0.7] tracking-normal">
          THINGS
        </h1>
      </div>

      {/* Bottom Command Line (search bar) - full width */}
      <div className="fixed bottom-0 left-0 right-0 z-[100001] bg-paper border-t border-border">
        <div className="px-4 py-2 md:px-8">
          <div className="flex flex-col gap-2">
            {/* Filters (below divider, above search) */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] sm:text-xs transition-all duration-300">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2 py-1 transition-colors ${
                  filters.category === 'all'
                    ? 'text-ink bg-paper-dark'
                    : 'text-ink-light hover:text-ink'
                }`}
                aria-label={inventoryMode === 'digital' ? 'Scroll to top' : 'Show all categories'}
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
                  aria-label={inventoryMode === 'digital' ? `Scroll to ${cat.label}` : `Filter by ${cat.label}`}
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
