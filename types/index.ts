export type KnownBrand =
  | 'Apple'
  | 'Floyd'
  | 'Ikea'
  | 'Nomatiq'
  | 'Sharge'
  | 'Xiaomi'
  | 'Secret Lab'
  | 'Rayban Meta'
  | 'Anker'
  | 'Blunt'
  | 'Nigh Collective'

// Allow arbitrary brand strings coming from the database (Notion), while still
// keeping autocomplete for known brands.
export type Brand = KnownBrand | (string & {})

export type Category =
  | 'tech'
  | 'home'
  | 'essential'
  | 'wishlist'
  | 'game'
  | 'software'
  | 'watchlist'

export interface Product {
  id: string
  name: string
  brand?: Brand
  category: Category
  price: number
  note: string
  url: string
  coverImage: string
  darkModeCoverImage?: string
  date: string
  createdTime: string
}

export type DisplayMode = 'grid' | 'list' | 'stack' | 'shuffle'

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'

export type CategoryFilter = 'all' | Category

export interface FilterState {
  category: CategoryFilter
}
