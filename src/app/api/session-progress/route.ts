import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update session progress
export async function POST(request: NextRequest) {
  try {
    const { sessionId, participantId, status } = await request.json();

    if (!sessionId || !participantId || !status) {
      return NextResponse.json(
        { error: 'Session ID, participant ID, and status are required' },
        { status: 400 }
      );
    }

    // Upsert session progress
    const sessionProgress = await prisma.sessionProgress.upsert({
      where: {
        sessionId_participantId: {
          sessionId,
          participantId,
        },
      },
      update: {
        status,
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        participantId,
        status,
      },
      include: {
        session: {
          include: {
            category: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    // Recalculate course progress
    await updateCourseProgress(participantId, sessionProgress.session.category.courseId);

    return NextResponse.json({ sessionProgress });
  } catch (error) {
    console.error('Error updating session progress:', error);
    return NextResponse.json(
      { error: 'Failed to update session progress' },
      { status: 500 }
    );
  }
}

// Helper function to update course progress
async function updateCourseProgress(participantId: string, courseId: string) {
  // Get all sessions in the course
  const sessions = await prisma.session.findMany({
    where: {
      category: {
        courseId,
      },
    },
    include: {
      progress: {
        where: {
          participantId,
        },
      },
    },
  });

  // Calculate progress
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((session:any) => 
    session.progress.some((progress:any) => progress.status === 'completed')
  ).length;

  const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Update enrollment progress
  await prisma.courseEnrollment.updateMany({
    where: {
      participantId,
      courseId,
    },
    data: {
      progress,
    },
  });
}