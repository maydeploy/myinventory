import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notionApiKey = process.env.NOTION_API_KEY
const notion = notionApiKey ? new Client({ auth: notionApiKey }) : null

// Fetch fresh image URL from Notion API using page ID and property
async function getFreshNotionImageUrl(
  pageId: string,
  propertyName?: string,
  isCover?: boolean
): Promise<string | null> {
  if (!notion) return null

  try {
    // Fetch the page to get fresh file URLs
    // Note: pages.retrieve returns the page with cover, but properties might need database query
    const page = await notion.pages.retrieve({ page_id: pageId })

    // Handle cover image
    if (isCover && page.cover) {
      if (page.cover.type === 'external') {
        return page.cover.external.url
      } else if (page.cover.type === 'file') {
        return page.cover.file.url
      }
    }

    // For properties, we need to query the database to get fresh property values
    if (propertyName && process.env.NOTION_DATABASE_ID) {
      try {
        // Query the database and find the page by ID
        // We'll paginate through results to find the matching page
        // Limit to first 500 pages to avoid timeout
        let cursor: string | undefined = undefined
        let found = false
        let matchingPage: any = null
        let pageCount = 0
        const maxPages = 500 // Safety limit

        do {
          const dbQuery = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            start_cursor: cursor,
            page_size: 100,
          })

          // Find the page in this batch
          matchingPage = dbQuery.results.find((p: any) => p.id === pageId)
          if (matchingPage) {
            found = true
            break
          }

          pageCount++
          cursor = dbQuery.has_more && pageCount < maxPages 
            ? (dbQuery.next_cursor ?? undefined) 
            : undefined
        } while (cursor && !found)

        if (matchingPage && (matchingPage as any).properties) {
          const properties = (matchingPage as any).properties
          const prop = properties[propertyName]
          if (prop?.files?.[0]) {
            const file = prop.files[0]
            return file.file?.url || file.external?.url || null
          }
        }
      } catch (propError) {
        console.error('Error fetching property from database:', propError)
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching fresh URL from Notion:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const rawSearch = request.nextUrl.search

    // Try to extract URL parameters
    const pageId = request.nextUrl.searchParams.get('pageId')
    const propertyName = request.nextUrl.searchParams.get('property')
    const isCover = request.nextUrl.searchParams.get('cover') === 'true'

    // The URL parameter contains & characters in its query string, which breaks standard parsing
    // We need to manually extract it by finding 'url=' and then finding where our actual params start
    let imageUrl: string | null = null

    // First try standard parsing
    imageUrl = request.nextUrl.searchParams.get('url')

    // If standard parsing fails or returns null, try manual extraction
    if (!imageUrl) {
      const urlParamStart = rawSearch.indexOf('url=')
      if (urlParamStart !== -1) {
        // Extract everything after 'url='
        let urlValue = rawSearch.substring(urlParamStart + 4) // +4 for "url="

        // Find where our actual parameters start (they come after the URL)
        // Look for '&pageId=', '&property=', or '&cover=' - these are our real params
        const pageIdMarker = urlValue.indexOf('&pageId=')
        const propertyMarker = urlValue.indexOf('&property=')
        const coverMarker = urlValue.indexOf('&cover=')

        // Find the earliest marker (our params start there)
        const markers = [pageIdMarker, propertyMarker, coverMarker].filter(m => m !== -1)
        if (markers.length > 0) {
          const firstMarker = Math.min(...markers)
          urlValue = urlValue.substring(0, firstMarker)
        }

        // Decode the URL
        try {
          imageUrl = decodeURIComponent(urlValue)
        } catch (e) {
          console.error('Failed to decode URL:', e)
          imageUrl = urlValue
        }
      }
    }

    if (!imageUrl) {
      console.error('Missing image URL in request')
      return new NextResponse('Missing image URL', { status: 400 })
    }

    // Validate it's a proper URL
    let isValidUrl = false
    let urlError: any = null
    try {
      new URL(imageUrl)
      isValidUrl = true
    } catch (e) {
      urlError = e
      console.error('Invalid URL format:', {
        urlPreview: imageUrl.substring(0, 200),
        urlLength: imageUrl.length,
        error: e instanceof Error ? e.message : String(e)
      })
    }

    if (!isValidUrl) {
      return new NextResponse(`Invalid URL format: ${urlError instanceof Error ? urlError.message : 'Unknown error'}`, { status: 400 })
    }

    // If it's an external URL (not from Notion), fetch it directly
    if (!imageUrl.includes('amazonaws.com') && !imageUrl.includes('notion.so')) {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        return new NextResponse('Failed to fetch image', { status: response.status })
      }
      const imageBuffer = await response.arrayBuffer()
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // For Notion file URLs (which are actually AWS S3 URLs), fetch without extra auth headers
    // AWS S3 signed URLs already contain authentication in the URL parameters
    // Adding Authorization header would invalidate the AWS signature
    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0',
    }

    let response: Response
    try {
      response = await fetch(imageUrl, {
        headers,
        redirect: 'follow',
      })
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      // If fetch fails and we have pageId, try to get fresh URL
      if (pageId) {
        console.log('Fetch failed, attempting to get fresh URL from Notion...')
        const freshUrl = await getFreshNotionImageUrl(
          pageId,
          propertyName || undefined,
          isCover
        )
        if (freshUrl) {
          console.log('Got fresh URL, retrying fetch...')
          try {
            response = await fetch(freshUrl, {
              headers,
              redirect: 'follow',
            })
          } catch (retryError) {
            console.error('Retry fetch also failed:', retryError)
            return new NextResponse('Failed to fetch image', { status: 500 })
          }
        } else {
          return new NextResponse('Failed to fetch image and could not refresh URL', { status: 500 })
        }
      } else {
        return new NextResponse('Failed to fetch image', { status: 500 })
      }
    }

    // If the URL expired (403, 404, etc.) and we have metadata to refresh it
    if (!response.ok && pageId && (response.status === 403 || response.status === 404 || response.status === 400)) {
      console.log(`Image URL failed (${response.status}), fetching fresh URL from Notion...`)
      
      // Try to get a fresh URL from Notion
      const freshUrl = await getFreshNotionImageUrl(
        pageId,
        propertyName || undefined,
        isCover
      )

      if (freshUrl) {
        console.log('Got fresh URL from Notion, fetching image...')
        imageUrl = freshUrl
        // Try fetching with the fresh URL
        try {
          response = await fetch(imageUrl, {
            headers,
            redirect: 'follow',
          })
        } catch (retryError) {
          console.error('Failed to fetch with fresh URL:', retryError)
          return new NextResponse('Failed to fetch image with fresh URL', { status: 500 })
        }
      } else {
        console.error('Could not get fresh URL from Notion')
      }
    }

    if (!response.ok) {
      console.error('Failed to fetch Notion image:', {
        url: imageUrl.substring(0, 100),
        status: response.status,
        statusText: response.statusText,
        pageId,
        propertyName,
      })
      return new NextResponse(`Failed to fetch image: ${response.status} ${response.statusText}`, { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('Content-Type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

