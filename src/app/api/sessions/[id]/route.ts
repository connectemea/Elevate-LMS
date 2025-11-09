import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update a session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    const { title, assetLink, assetType, orderIndex } = await request.json();

    const session = await prisma.session.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(assetLink && { assetLink }),
        ...(assetType && { assetType }),
        ...(orderIndex !== undefined && { orderIndex }),
      },
      include: {
        category: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// Delete a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params;
    await prisma.session.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}