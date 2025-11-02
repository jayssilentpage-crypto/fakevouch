import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

// Get user history and templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await ensureDir(DATA_DIR)
    const filePath = path.join(DATA_DIR, `${session.user.id}.json`)

    if (existsSync(filePath)) {
      const data = await readFile(filePath, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    }

    return NextResponse.json({ history: [], templates: [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Save history or template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body // type: 'history' or 'template'

    await ensureDir(DATA_DIR)
    const filePath = path.join(DATA_DIR, `${session.user.id}.json`)
    
    let existing: any = { history: [], templates: [] }
    if (existsSync(filePath)) {
      const fileData = await readFile(filePath, 'utf-8')
      existing = JSON.parse(fileData)
    }

    if (type === 'history') {
      existing.history = [data, ...(existing.history || [])].slice(0, 100) // Keep last 100
    }

    if (type === 'template') {
      existing.templates = existing.templates || []
      existing.templates.push({
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })
    } else if (type !== 'history') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    await writeFile(filePath, JSON.stringify(existing, null, 2))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Delete history or template
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    const filePath = path.join(DATA_DIR, `${session.user.id}.json`)
    if (existsSync(filePath)) {
      const fileData = await readFile(filePath, 'utf-8')
      const data = JSON.parse(fileData)
      
      if (type === 'history') {
        data.history = data.history.filter((h: any) => h.id !== id)
      }

      if (type === 'template') {
        data.templates = data.templates.filter((t: any) => t.id !== id)
      }
      
      await writeFile(filePath, JSON.stringify(data, null, 2))
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

