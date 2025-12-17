'use client'

import { useState } from 'react'
import type { FilterState, Category, Brand } from '@/types'

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onClose: () => void
  totalProducts: number
  allBrands: Brand[]
}

const categories: { value: Category; label: string; color: string }[] = [
  { value: 'tech', label: 'Tech', color: '#FF8C42' },
  { value: 'home', label: 'Home', color: '#42A5FF' },
  { value: 'workspace', label: 'Workspace', color: '#A542FF' },
  { value: 'pet', label: 'Pet', color: '#FF42A5' },
  { value: 'essentials', label: 'Essentials', color: '#42FFA5' },
  { value: 'wishlist', label: 'Wishlist', color: '#FFD700' },
]

export default function FilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  totalProducts,
  allBrands,
}: FilterSidebarProps) {
  const [priceMin, setPriceMin] = useState(filters.priceRange[0])
  const [priceMax, setPriceMax] = useState(filters.priceRange[1])

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

  const applyPriceFilter = () => {
    onFiltersChange({ ...filters, priceRange: [priceMin, priceMax] })
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed top-0 left-0 h-full w-80 bg-beige border-r-2 border-tan
          transform transition-transform duration-300 z-40
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ marginTop: '120px' }}
      >
        <div className="p-6">
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 text-2xl text-gray-medium hover:text-orange"
            aria-label="Close filters"
          >
            ✕
          </button>

          <h2 className="text-xl font-bold mb-6 text-gray-dark">FILTERS</h2>

          {/* Category filter */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-gray-dark">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-orange-light p-2 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                    className="w-4 h-4"
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand filter */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-gray-dark">Brand</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allBrands.sort().map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer hover:bg-orange-light p-2 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-gray-dark">Price Range</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  placeholder="Min"
                  className="w-full px-2 py-1 border-2 border-tan bg-white"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  placeholder="Max"
                  className="w-full px-2 py-1 border-2 border-tan bg-white"
                />
              </div>
              <button
                onClick={applyPriceFilter}
                className="w-full px-4 py-2 bg-orange text-white hover:bg-opacity-90 transition-colors"
              >
                Apply
              </button>
              <p className="text-sm text-gray-medium text-center">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </p>
            </div>
          </div>

          {/* Wishlist only */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-orange-light p-2 transition-colors">
              <input
                type="checkbox"
                checked={filters.wishlistOnly}
                onChange={(e) =>
                  onFiltersChange({ ...filters, wishlistOnly: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="font-bold">Wishlist Only</span>
            </label>
          </div>
        </div>
      </aside>
    </>
  )
}
