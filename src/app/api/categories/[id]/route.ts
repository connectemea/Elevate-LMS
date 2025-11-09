import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }>  }
) {

    const { id } = await params;
  try {
    const { name, description,orderIndex } = await request.json()

    const category = await prisma.courseCategory.update({
      where: { id: id },
      data: {
        name,
        description,
        orderIndex,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    await prisma.courseCategory.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}