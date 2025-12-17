'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Header from '@/components/Header'
import FilterSidebar from '@/components/FilterSidebar'
import ProductGrid from '@/components/ProductGrid'
import ProductList from '@/components/ProductList'
import ProductDetail from '@/components/ProductDetail'
import DotGrid from '@/components/DotGrid'
import type { Product, DisplayMode, FilterState, SortOption } from '@/types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const { data, error, isLoading } = useSWR<{ products: Product[] }>('/api/products', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5 minutes
  })

  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('date-desc')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    wishlistOnly: false,
  })
  const [filterOpen, setFilterOpen] = useState(false)

  // Filter and sort products
  const filteredProducts = data?.products.filter((product) => {
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

    // Wishlist filter
    if (filters.wishlistOnly && product.category !== 'wishlist') {
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
      wishlistOnly: false,
    })
    setSearchQuery('')
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.wishlistOnly ||
    searchQuery !== ''

  return (
    <div className="min-h-screen dot-grid">
      <DotGrid />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        onFilterToggle={() => setFilterOpen(!filterOpen)}
      />

      <div className="flex">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          totalProducts={data?.products.length || 0}
          allBrands={Array.from(new Set(data?.products.map(p => p.brand) || []))}
        />

        <main className="flex-1 p-4 md:p-8 lg:ml-80">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-medium">
              Showing {sortedProducts.length} of {data?.products.length || 0} products
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="ml-4 text-orange hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">⌛</div>
                <p className="text-gray-medium">Loading inventory...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-gray-medium">Unable to load products. Please try again.</p>
              </div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-medium">
                  {hasActiveFilters
                    ? 'No products found. Try adjusting filters.'
                    : 'No products yet. Check back soon!'}
                </p>
              </div>
            </div>
          ) : displayMode === 'grid' ? (
            <ProductGrid
              products={sortedProducts}
              onProductClick={setSelectedProduct}
            />
          ) : (
            <ProductList
              products={sortedProducts}
              onProductClick={setSelectedProduct}
            />
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}
