'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import DotGrid from '@/components/DotGrid'
import type { Product, FilterState, SortOption } from '@/types'
import { isDigitalCategory } from '@/lib/categories'

const fetcher = async (url: string) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  const res = await fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timeout))
  const text = await res.text()
  let data: any
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ? String(data.error || data.message)
        : text ? text.slice(0, 200)
          : `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data
}

type InventoryMode = 'physical' | 'digital'

export default function Home() {
  const { data, error, isLoading } = useSWR<{ products: Product[] }>('/api/products', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5 minutes
  })

  const [inventoryMode, setInventoryMode] = useState<InventoryMode>('physical')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('price-asc')
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
  })

  const handleInventoryModeChange = (mode: InventoryMode) => {
    setInventoryMode(mode)
    // Reset category filters when switching modes so we don't end up with invalid selections.
    // For digital mode, default to watchlist
    setFilters((prev) => ({ ...prev, category: mode === 'digital' ? 'watchlist' : 'all' }))
  }


  const modeFilteredProducts = (data?.products || []).filter((product) => {
    const isDigital = isDigitalCategory(product.category)
    return inventoryMode === 'digital' ? isDigital : !isDigital
  })

  // Filter and sort products
  const filteredProducts = modeFilteredProducts.filter((product) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        (product.brand ? product.brand.toLowerCase().includes(query) : false) ||
        product.note?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
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
      category: 'all',
    })
    setSearchQuery('')
  }

  const hasActiveFilters =
    filters.category !== 'all' ||
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
        filters={filters}
        onFiltersChange={setFilters}
      />

      <main className="flex-1 p-4 md:p-8 pb-44 md:pb-[13.5rem] pl-28 md:pl-32">
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
              {error?.message ? (
                <p className="text-ink-lighter text-xs mt-2 max-w-md mx-auto break-words">
                  {String(error.message)}
                </p>
              ) : null}
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
        ) : (
          <ProductGrid
            products={sortedProducts}
            onProductClick={() => {}}
          />
        )}
      </main>
    </div>
  )
}
