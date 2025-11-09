import { NextResponse } from 'next/server'
import { getParticipantStats, getProgressByYear } from '@/lib/participant'

export async function GET() {
  try {
    const [basicStats, progressByYear] = await Promise.all([
      getParticipantStats(),
      getProgressByYear()
    ])

    return NextResponse.json({
      basicStats,
      progressByYear
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch participant stats' },
      { status: 500 }
    )
  }
}