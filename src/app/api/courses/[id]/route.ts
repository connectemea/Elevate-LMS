import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }>  }) {
 const { id } = await params;
  try {
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing course ID' }, { status: 400 })
    }

    const existing = await prisma.course.findUnique({ where: { id: id } })

    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const updated = await prisma.course.update({
      where: { id: id },
      data: {
        name: body.name,
        description: body.description,
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('PATCH error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


export async function DELETE(
  request: Request,
   { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    await prisma.course.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}