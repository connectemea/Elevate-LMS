import { NextRequest, NextResponse } from 'next/server';

type Handler<T = any> = (
  req: NextRequest,
  context: { params: Promise<T> }
) => Promise<Response>;

export function apiHandler<T = any>(handler: Handler<T>) {
  return async (req: NextRequest, context: { params: Promise<T> }): Promise<Response> => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}