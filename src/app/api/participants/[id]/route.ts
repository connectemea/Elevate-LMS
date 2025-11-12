import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    console.log("📘 Fetching participant:", id);

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: true, // ✅ valid relation
          },
        },
        sessionStatus: {
          include: {
            session: true, // ✅ valid relation
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    return NextResponse.json({ participant });
  } catch (error: any) {
    console.error("❌ Error fetching participant:", error);
    return NextResponse.json(
      { error: 'Failed to fetch participant', details: error.message },
      { status: 500 }
    );
  }
}




export async function PUT(
  request: Request,
   { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    const { name, email, year } = await request.json()

    const participant = await prisma.participant.update({
      where: { id },
      data: {
        name,
        email,
        year: parseInt(year),
      },
    })

    return NextResponse.json(participant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update participant' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    await prisma.participant.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete participant' },
      { status: 500 }
    )
  }
}