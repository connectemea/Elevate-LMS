import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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