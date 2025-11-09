import { NextResponse } from 'next/server'
import { getCourseEnrollmentStats, getPopularCourses } from '@/lib/course'

export async function GET() {
  try {
    const [enrollmentStats, popularCourses] = await Promise.all([
      getCourseEnrollmentStats(),
      getPopularCourses()
    ])

    return NextResponse.json({
      enrollmentStats,
      popularCourses
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch course stats' },
      { status: 500 }
    )
  }
}