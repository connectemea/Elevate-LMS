import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Create a new session
export async function POST(request: NextRequest) {
  try {
    const { categoryId, title, assetLink, assetType, orderIndex } = await request.json();

    if (!categoryId || !title || !assetLink || !assetType || orderIndex === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const session = await prisma.session.create({
      data: {
        categoryId,
        title,
        assetLink,
        assetType,
        orderIndex,
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
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}