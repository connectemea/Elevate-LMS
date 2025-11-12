import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import path to your setup

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // courseId

    console.log("Fetching enrollments for courseId:", id);

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { 
        courseId: id // This should filter by the course ID from params
      },
      include: {
        participant: {
          select: {
            id: true,
            name: true,
            email: true,
            sessionStatus: {
              select: {
                status: true,
                session: {
                  select: {
                    id: true,
                    categoryId: true,
                    category: {
                      select: { 
                        courseId: true 
                      },
                    },
                  },
                },
              },
            },
          },
        },
        course: {
          include: {
            categories: {
              include: {
                sessions: true,
              },
            },
          },
        },
      },
    });

    console.log("Raw enrollments from DB:", enrollments);

    const result = enrollments.map((enrollment: any) => {
      const allSessions = enrollment.course.categories.flatMap((c: any) => c.sessions) || [];

      // Filter completed sessions for THIS course only
      const completed = enrollment.participant.sessionStatus.filter(
        (s: any) =>
          s.status === "completed" &&
          s.session.category.courseId === id // Use the course ID from params
      ).length;

      const totalSessions = allSessions.length;
      const progress = totalSessions === 0 ? 0 : Math.round((completed / totalSessions) * 100);

      return {
        key: enrollment.id,
        enrollmentId: enrollment.id,
        courseId: enrollment.course.id, // This should match the requested course ID
        courseName: enrollment.course.name,
        user: {
          id: enrollment.participant.id,
          name: enrollment.participant.name,
          email: enrollment.participant.email || "",
        },
        progress,
        completedSessions: completed,
        totalSessions,
        enrolledAt: enrollment.enrolledAt,
      };
    });

    console.log("Processed enrollments result:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

