import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
 { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;

    const enrollmentData: Array<{
      enrollmentId: string;
      user: { id: string; name?: string };
      progress: number;
    }> = [
      // Example item (remove or replace when implementing real fetching)
      { enrollmentId: `enr-${id}-1`, user: { id: 'user-1', name: 'John Doe' }, progress: 0 }
    ];

    // Your implementation to fetch enrollments with user data and progress
    return NextResponse.json({ enrollments: enrollmentData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}