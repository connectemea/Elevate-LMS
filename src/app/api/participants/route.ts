import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from "@/lib/supabase-admin";

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


export async function POST(req: Request) {
  try {
    const { name, email, year } = await req.json();

    const password = email.split("@")[0] + "123";

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "participant" },
      });

    if (authError) {
      if (authError.status === 422 && authError.code === "email_exists") {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
      throw authError;
    }

    const participant = await prisma.participant.create({
      data: {
        id: authUser.user.id,
        name,
        email,
        year: Number(year),
      },
    });

    return NextResponse.json({ participant });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create participant", details: err },
      { status: 500 }
    );
  }
}




// export async function POST(request: Request) {
//   try {
//     const { name, email, year } = await request.json()

//     const participant = await prisma.participant.create({
//       data: {
//         name,
//         email,
//         year: parseInt(year),
//       },
//     })

//     return NextResponse.json(participant)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create participant' },
//       { status: 500 }
//     )
//   }
// }