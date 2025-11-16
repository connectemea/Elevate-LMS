import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all enrollments for a course
export async function GET(
  request: Request,
    { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        courseId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}

// POST single enrollment
export async function POST(request: Request) {
  try {
    const { participantId, courseId } = await request.json()

    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        participantId_courseId: {
          participantId,
          courseId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Participant is already enrolled in this course' },
        { status: 400 }
      )
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        participantId,
        courseId,
      },
    })

    return NextResponse.json(enrollment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    )
  }
}
