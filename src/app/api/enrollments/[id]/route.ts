import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST bulk enrollments
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const { participantIds } = await request.json(); // Changed to participantIds

    console.log('Received enrollment request:', { courseId, participantIds });

    // Validate input
    if (!participantIds || !Array.isArray(participantIds)) {
      return NextResponse.json(
        { error: 'Participant IDs array is required' },
        { status: 400 }
      );
    }

    if (participantIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one participant must be selected' },
        { status: 400 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify all participants exist
    const participants = await prisma.participant.findMany({
      where: {
        id: {
          in: participantIds,
        },
      },
      select: {
        id: true,
      },
    });

    const foundParticipantIds = participants.map((p:any) => p.id);
    const missingParticipantIds = participantIds.filter(id => !foundParticipantIds.includes(id));

    if (missingParticipantIds.length > 0) {
      return NextResponse.json(
        { error: `Some participants not found: ${missingParticipantIds.join(', ')}` },
        { status: 404 }
      );
    }

    // Check existing enrollments to avoid duplicates
    const existingEnrollments = await prisma.courseEnrollment.findMany({
      where: {
        courseId,
        participantId: { // Changed from userId to participantId
          in: participantIds,
        },
      },
      select: {
        participantId: true, // Changed from userId
      },
    });

    const existingParticipantIds = existingEnrollments.map((e:any) => e.participantId);
    const newParticipantIds = participantIds.filter(id => !existingParticipantIds.includes(id));

    console.log('Enrollment summary:', {
      totalRequested: participantIds.length,
      alreadyEnrolled: existingParticipantIds.length,
      toEnroll: newParticipantIds.length
    });

    if (newParticipantIds.length === 0) {
      return NextResponse.json(
        { 
          error: 'All selected participants are already enrolled in this course',
          details: {
            alreadyEnrolled: existingParticipantIds
          }
        },
        { status: 400 }
      );
    }

    // Create bulk enrollments
    const enrollments = await prisma.courseEnrollment.createMany({
      data: newParticipantIds.map(participantId => ({
        participantId, // Changed from userId
        courseId,
      })),
      skipDuplicates: true,
    });

    console.log('Successfully created enrollments:', enrollments);

    return NextResponse.json({
      success: true,
      message: `Successfully enrolled ${newParticipantIds.length} participant${newParticipantIds.length !== 1 ? 's' : ''}`,
      enrolled: newParticipantIds.length,
      alreadyEnrolled: existingParticipantIds.length,
      total: participantIds.length,
    });
  } catch (error) {
    console.error('Error creating bulk enrollments:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create enrollments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }>  }
) {
    const { id } = await params;
  try {
    await prisma.courseEnrollment.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete enrollment' },
      { status: 500 }
    )
  }
}