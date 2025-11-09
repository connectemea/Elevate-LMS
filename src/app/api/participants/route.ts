import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        enrollments: {
          include: {
            course: {
              select: { name: true }
            }
          }
        },
        sessionStatus: {
          include: {
            session: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data for frontend
    const transformedParticipants = participants.map((participant :any) => ({
      ...participant,
      enrollments: participant.enrollments.map((enrollment: any) => ({
        ...enrollment,
        courseName: enrollment.course.name
      })),
      sessionProgress: participant.sessionStatus.map((progress: any) => ({
        ...progress,
        sessionTitle: progress.session.title
      }))
    }))

    return NextResponse.json({ participants: transformedParticipants })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, year } = await request.json()

    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        year: parseInt(year),
      },
    })

    return NextResponse.json(participant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create participant' },
      { status: 500 }
    )
  }
}