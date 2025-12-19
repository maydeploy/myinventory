import type { Category } from '@/types'

export function isDigitalCategory(category: Category): boolean {
  return category === 'game' || category === 'software' || category === 'watchlist'
}




