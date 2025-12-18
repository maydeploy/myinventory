import type { Category, Product } from '@/types'
import Image from 'next/image'

const categories: { value: Category; label: string }[] = [
  { value: 'tech', label: 'tech' },
  { value: 'home', label: 'home' },
  { value: 'workspace', label: 'workspace' },
  { value: 'pet', label: 'pet' },
  { value: 'essentials', label: 'essentials' },
  { value: 'wishlist', label: 'wishlist' },
]

export default function ProductStackView({
  products,
  onSelectCategory,
}: {
  products: Product[]
  onSelectCategory: (category: Category) => void
}) {
  const byCategory = categories
    .map((c) => ({
      ...c,
      items: products.filter((p) => p.category === c.value),
    }))
    .filter((c) => c.items.length > 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {byCategory.map((cat) => {
          const previews = cat.items.slice(0, 3)
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className="text-left bg-white border border-border hover:border-accent transition-all p-4"
            >
              <div className="flex items-end justify-between mb-3">
                <div className="font-display uppercase tracking-wider text-ink">
                  {cat.label}
                </div>
                <div className="text-xs text-ink-lighter font-mono">
                  {cat.items.length} items
                </div>
              </div>

              {/* Stacked previews */}
              <div className="relative h-44">
                {previews.map((p, idx) => (
                  <div
                    key={p.id}
                    className="absolute top-0 left-0 w-full h-full border border-border bg-paper overflow-hidden"
                    style={{
                      transform: `translate(${idx * 10}px, ${idx * 10}px) rotate(${idx * 1.2}deg)`,
                      zIndex: previews.length - idx,
                    }}
                  >
                    {p.coverImage ? (
                      <Image
                        src={p.coverImage}
                        alt={p.name}
                        fill
                        className="object-cover opacity-70"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-ink-lighter">
                        [ ]
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-border px-3 py-2">
                      <div className="font-mono text-xs text-ink line-clamp-1">
                        {p.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs font-mono text-ink-light">
                click to expand →
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}


