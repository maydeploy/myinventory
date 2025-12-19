import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

export async function GET() {
  const hasNotionApiKey = Boolean(process.env.NOTION_API_KEY)
  const hasDatabaseId = Boolean(process.env.NOTION_DATABASE_ID)

  // Never return secrets; this endpoint is only for quick debugging.
  const base = {
    ok: true,
    env: {
      hasNotionApiKey,
      hasDatabaseId,
    },
  }

  // If env vars aren't present, don't attempt a Notion call.
  if (!hasNotionApiKey || !hasDatabaseId) {
    return NextResponse.json({
      ...base,
      notion: { attempted: false },
    })
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY })
    const resp = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID as string,
      page_size: 1,
    })

    return NextResponse.json({
      ...base,
      notion: {
        attempted: true,
        ok: true,
        results: resp.results.length,
      },
    })
  } catch (e: any) {
    return NextResponse.json(
      {
        ...base,
        ok: false,
        notion: {
          attempted: true,
          ok: false,
          errorName: e?.name ?? 'Error',
          errorMessage: e?.message ?? String(e),
        },
      },
      { status: 500 },
    )
  }
}





