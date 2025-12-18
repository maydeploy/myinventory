'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import ProductList from '@/components/ProductList'
import ProductDetail from '@/components/ProductDetail'
import DotGrid from '@/components/DotGrid'
import ProductStackView from '@/components/ProductStackView'
import ProductShuffleView from '@/components/ProductShuffleView'
import type { Category, Product, DisplayMode, FilterState, SortOption } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

type InventoryMode = 'physical' | 'digital'

export default function Home() {
  const { data, error, isLoading } = useSWR<{ products: Product[] }>('/api/products', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5 minutes
  })

  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid')
  const [inventoryMode, setInventoryMode] = useState<InventoryMode>('physical')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name-asc')
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
  })
  const [filterOpen, setFilterOpen] = useState(false)
  const [stackCategory, setStackCategory] = useState<Category | null>(null)

  const handleInventoryModeChange = (mode: InventoryMode) => {
    setInventoryMode(mode)
    // Reset category/brand filters when switching modes so we don't end up with invalid selections.
    setFilters((prev) => ({ ...prev, categories: [], brands: [] }))
    setStackCategory(null)
  }

  const modeFilteredProducts = (data?.products || []).filter((product) => {
    const isDigital = product.category === 'games' || product.category === 'software'
    return inventoryMode === 'digital' ? isDigital : !isDigital
  })

  // Filter and sort products
  const filteredProducts = modeFilteredProducts.filter((product) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.note?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }

    return true
  }) || []

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'date-desc':
        return new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      case 'date-asc':
        return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 1000],
    })
    setSearchQuery('')
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    searchQuery !== ''

  return (
    <div className="min-h-screen dot-grid">
      <DotGrid />

      <Header
        inventoryMode={inventoryMode}
        onInventoryModeChange={handleInventoryModeChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        onFilterToggle={() => setFilterOpen(!filterOpen)}
        filterOpen={filterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        allBrands={Array.from(new Set(modeFilteredProducts.map(p => p.brand)))}
      />

      <div className="flex">
        <main className={`flex-1 p-4 md:p-8 ${filterOpen ? 'pb-64' : 'pb-16'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-ink-lighter font-mono text-sm">loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-ink-light font-mono text-sm">connection failed</p>
                <p className="text-ink-lighter text-xs mt-2">check your network</p>
              </div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-ink-lighter font-mono text-sm">
                  {hasActiveFilters
                    ? 'no results found'
                    : 'no items yet'}
                </p>
              </div>
            </div>
          ) : displayMode === 'grid' ? (
            <ProductGrid
              products={sortedProducts}
              onProductClick={() => {}}
            />
          ) : displayMode === 'list' ? (
            <ProductList
              products={sortedProducts}
              onProductClick={() => {}}
            />
          ) : displayMode === 'stack' ? (
            stackCategory ? (
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-ink-lighter">
                    category: <span className="text-ink">{stackCategory}</span>
                  </div>
                  <button
                    onClick={() => setStackCategory(null)}
                    className="px-2 py-1 border border-border hover:bg-paper-dark transition-all text-xs text-ink-light"
                  >
                    [back to stacks]
                  </button>
                </div>
                <ProductGrid
                  products={sortedProducts.filter(p => p.category === stackCategory)}
                  onProductClick={() => {}}
                />
              </div>
            ) : (
              <ProductStackView
                products={sortedProducts}
                onSelectCategory={(c) => setStackCategory(c)}
              />
            )
          ) : (
            <ProductShuffleView products={sortedProducts} />
          )}
        </main>
      </div>
    </div>
  )
}
