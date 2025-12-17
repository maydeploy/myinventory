import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import type { Product } from '@/types'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const databaseId = process.env.NOTION_DATABASE_ID || '2c3240181b7d81acb391000b42ff5dc4'

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    })

    const products: Product[] = response.results.map((page: any) => {
      const properties = page.properties

      // Extract cover image
      let coverImage = ''
      if (page.cover?.type === 'external') {
        coverImage = page.cover.external.url
      } else if (page.cover?.type === 'file') {
        coverImage = page.cover.file.url
      } else if (properties.Image?.files?.[0]) {
        coverImage = properties.Image.files[0].file?.url || properties.Image.files[0].external?.url || ''
      }

      // Extract title/name
      const name =
        properties.Name?.title?.[0]?.plain_text ||
        properties.Title?.title?.[0]?.plain_text ||
        'Untitled'

      // Extract brand
      const brand =
        properties.Brand?.select?.name ||
        properties.Vendor?.select?.name ||
        'Unknown'

      // Extract category
      const category =
        properties.Category?.select?.name?.toLowerCase() ||
        properties.Type?.select?.name?.toLowerCase() ||
        'essentials'

      // Extract price
      const price = properties.Price?.number || 0

      // Extract note
      const note =
        properties.Note?.rich_text?.[0]?.plain_text ||
        properties.Description?.rich_text?.[0]?.plain_text ||
        ''

      // Extract URL
      const url =
        properties.URL?.url ||
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
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    )
  }
}
