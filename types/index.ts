export type Brand =
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

export type Category = 'tech' | 'home' | 'workspace' | 'pet' | 'essentials' | 'wishlist'

export interface Product {
  id: string
  name: string
  brand: Brand
  category: Category
  price: number
  note: string
  url: string
  coverImage: string
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

export interface FilterState {
  categories: Category[]
  brands: Brand[]
  priceRange: [number, number]
}

export interface ImageFxSettings {
  ditherOnHover: boolean
  ditherOpacity: number // 0..1
  contrast: number // e.g. 0.5..3
  bias: number // e.g. -80..80
  saturation: number // e.g. 0..2
}
