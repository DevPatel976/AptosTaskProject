import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${params.taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch task');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const response = await fetch(`http://localhost:3001/api/tasks/${params.taskId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to execute task');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute task' },
      { status: 500 }
    );
  }
}
