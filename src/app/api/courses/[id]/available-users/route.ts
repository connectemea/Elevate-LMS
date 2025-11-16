// /app/api/courses/[id]/available-users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const courseId = id

    // Get participants not enrolled in this course
    const enrolledParticipants = await prisma.courseEnrollment.findMany({
      where: { courseId },
      select: { participantId: true },
    })
    
    const enrolledParticipantIds = enrolledParticipants.map((e:any) => e.participantId)

    // Fetch all participants (simplified - no search for now)
    const participants = await prisma.participant.findMany({
      where: {
        id: {
          notIn: enrolledParticipantIds.length > 0 ? enrolledParticipantIds : []
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(participants)
  } catch (error) {
    console.error('Error fetching participants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    )
  }
}