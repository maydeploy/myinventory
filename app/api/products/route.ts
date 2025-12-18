import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import type { Brand, Category, Product } from '@/types'

const notionApiKey = process.env.NOTION_API_KEY
const databaseId = process.env.NOTION_DATABASE_ID

// Only initialize the Notion client when we actually have a token.
const notion = notionApiKey ? new Client({ auth: notionApiKey }) : null

function toBrand(value: string | undefined): Brand {
  // Keep strict Brand typing without failing at runtime if Notion has other brands.
  // Unknown brands are bucketed into an existing Brand option.
  const v = (value ?? '').trim()
  const allowed: Brand[] = [
    'Apple',
    'Floyd',
    'Ikea',
    'Nomatiq',
    'Sharge',
    'Xiaomi',
    'Secret Lab',
    'Rayban Meta',
    'Anker',
    'Blunt',
    'Nigh Collective',
  ]
  return (allowed.includes(v as Brand) ? (v as Brand) : 'Nomatiq')
}

function toCategory(value: string | undefined): Category {
  const v = (value ?? '').trim().toLowerCase()
  // Normalize a few common variants coming from Notion Select values
  const normalized =
    v === 'game' ? 'games'
      : v === 'sw' ? 'software'
        : v

  const allowed: Category[] = [
    'tech',
    'home',
    'workspace',
    'pet',
    'essentials',
    'wishlist',
    'games',
    'software',
  ]
  return (allowed.includes(normalized as Category) ? (normalized as Category) : 'essentials')
}

function getPlainTextFromTitle(prop: any): string | undefined {
  return prop?.title?.[0]?.plain_text
}

function getPlainTextFromRichText(prop: any): string | undefined {
  return prop?.rich_text?.[0]?.plain_text
}

function getUrlFromFiles(prop: any): string | undefined {
  const f = prop?.files?.[0]
  return f?.file?.url ?? f?.external?.url
}

function getSampleProducts(): Product[] {
  return [
    {
      id: 'sample-1',
      name: 'Mechanical Keyboard - TactX Pro',
      brand: 'Nomatiq',
      category: 'tech',
      price: 159.99,
      note: 'Hot-swappable switches. RGB backlight. Tactical feedback for command input.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      date: '2024-01-15',
      createdTime: '2024-01-15T10:00:00.000Z',
    },
    {
      id: 'sample-2',
      name: 'Ultrawide Monitor 34" QHD',
      brand: 'Apple',
      category: 'workspace',
      price: 599.0,
      note: 'Command center display. 144Hz refresh. Perfect for tactical overviews.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      date: '2024-01-14',
      createdTime: '2024-01-14T10:00:00.000Z',
    },
    {
      id: 'sample-3',
      name: 'Ergonomic Task Chair',
      brand: 'Secret Lab',
      category: 'workspace',
      price: 1299.0,
      note: 'Mission-critical seating. Full lumbar support for extended operations.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      date: '2024-01-13',
      createdTime: '2024-01-13T10:00:00.000Z',
    },
    {
      id: 'sample-4',
      name: 'Wireless Headset - Stealth Edition',
      brand: 'Sharge',
      category: 'tech',
      price: 179.99,
      note: 'Noise cancellation. 7.1 surround. Crystal-clear comms.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      date: '2024-01-12',
      createdTime: '2024-01-12T10:00:00.000Z',
    },
    {
      id: 'sample-5',
      name: 'Smart Coffee Maker',
      brand: 'Ikea',
      category: 'home',
      price: 299.0,
      note: 'Fuel station. Programmable brew cycles. Essential for night ops.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
      date: '2024-01-11',
      createdTime: '2024-01-11T10:00:00.000Z',
    },
    {
      id: 'sample-6',
      name: 'Standing Desk Frame',
      brand: 'Floyd',
      category: 'workspace',
      price: 599.0,
      note: 'Height adjustable. Memory presets. Tactical positioning system.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800',
      date: '2024-01-10',
      createdTime: '2024-01-10T10:00:00.000Z',
    },
    {
      id: 'sample-7',
      name: 'Precision Mouse - Viper Ultimate',
      brand: 'Xiaomi',
      category: 'tech',
      price: 149.99,
      note: 'Wireless. 20K DPI sensor. Zero latency. Surgical precision.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
      date: '2024-01-09',
      createdTime: '2024-01-09T10:00:00.000Z',
    },
    {
      id: 'sample-8',
      name: 'Robotic Vacuum Unit',
      brand: 'Xiaomi',
      category: 'home',
      price: 449.0,
      note: 'Autonomous cleaning protocol. LiDAR navigation. Base maintenance.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      date: '2024-01-08',
      createdTime: '2024-01-08T10:00:00.000Z',
    },
    {
      id: 'sample-9',
      name: 'Gaming Graphics Card RTX 4080',
      brand: 'Apple',
      category: 'wishlist',
      price: 1199.0,
      note: 'TARGET ACQUIRED. Next-gen ray tracing. Mission-critical upgrade.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
      date: '2024-01-07',
      createdTime: '2024-01-07T10:00:00.000Z',
    },
    {
      id: 'sample-10',
      name: 'Automatic Cat Feeder',
      brand: 'Xiaomi',
      category: 'pet',
      price: 89.99,
      note: 'Scheduled deployment. Companion support system. Voice recording.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1511694009171-3cdddf4484ff?w=800',
      date: '2024-01-06',
      createdTime: '2024-01-06T10:00:00.000Z',
    },
    {
      id: 'sample-11',
      name: 'USB-C Hub - 12-in-1',
      brand: 'Anker',
      category: 'tech',
      price: 79.99,
      note: 'Central connectivity node. All port types. Mission adapter.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800',
      date: '2024-01-05',
      createdTime: '2024-01-05T10:00:00.000Z',
    },
    {
      id: 'sample-12',
      name: 'Desk Lamp - LED Pro',
      brand: 'Ikea',
      category: 'workspace',
      price: 129.0,
      note: 'Auto-dimming. Eye-care technology. Illumination protocol.',
      url: 'https://example.com',
      coverImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
      date: '2024-01-04',
      createdTime: '2024-01-04T10:00:00.000Z',
    },
  ]
}

export async function GET() {
  try {
    // If the Notion credentials aren't set (common in local dev / previews),
    // return sample data instead of throwing.
    if (!notion || !databaseId) {
      return NextResponse.json({ products: getSampleProducts() })
    }

    // Fetch ALL pages (Notion paginates database queries).
    const allResults: any[] = []
    let cursor: string | undefined = undefined

    do {
      const resp = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100,
        sorts: [
          {
            timestamp: 'created_time',
            direction: 'descending',
          },
        ],
      })
      allResults.push(...resp.results)
      cursor = resp.has_more ? (resp.next_cursor ?? undefined) : undefined
    } while (cursor)

    const products: Product[] = allResults.map((page: any) => {
      const properties = page.properties

      // Extract cover image
      let coverImage = ''
      if (page.cover?.type === 'external') {
        coverImage = page.cover.external.url
      } else if (page.cover?.type === 'file') {
        coverImage = page.cover.file.url
      } else {
        // Prefer your explicit property: "Cover Image" (Files & media)
        coverImage =
          getUrlFromFiles(properties['Cover Image']) ||
          // Back-compat fallbacks
          getUrlFromFiles(properties.Image) ||
          ''
      }

      // Extract title/name
      const name =
        // Your explicit property: "Product Name" (Title)
        getPlainTextFromTitle(properties['Product Name']) ||
        // Back-compat fallbacks
        getPlainTextFromTitle(properties.Name) ||
        getPlainTextFromTitle(properties.Title) ||
        'Untitled'

      // Extract brand
      const brand = toBrand(
        properties.Brand?.select?.name ||
          properties.Brand?.rich_text?.[0]?.plain_text ||
          properties.Brand?.title?.[0]?.plain_text ||
          properties.Vendor?.select?.name,
      )

      // Extract category
      const category = toCategory(
        properties.Category?.select?.name ||
          properties.Category?.multi_select?.[0]?.name ||
          properties.Type?.select?.name,
      )

      // Extract price
      const price = properties.Price?.number || 0

      // Extract note
      const note =
        // Your explicit property: "Note" (Rich text)
        getPlainTextFromRichText(properties.Note) ||
        // Back-compat fallbacks
        getPlainTextFromRichText(properties.Description) ||
        ''

      // Extract URL
      const url =
        // Your explicit property: "URL" (URL)
        properties.URL?.url ||
        // Back-compat fallback
        properties.Link?.url ||
        ''

      // Extract date
      const date =
        properties.Date?.date?.start ||
        properties['Date Added']?.date?.start ||
        page.created_time

      return {
        id: page.id,
        name,
        brand,
        category,
        price,
        note,
        url,
        coverImage,
        date,
        createdTime: page.created_time,
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching from Notion:', error)

    // Return sample data when Notion is unavailable
    return NextResponse.json({ products: getSampleProducts() })
  }
}
