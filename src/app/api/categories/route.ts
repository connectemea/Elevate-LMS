import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, orderIndex, courseId } = await request.json()

    const category = await prisma.courseCategory.create({
      data: {
        name,
        orderIndex,
        courseId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}



