import { NextRequest, NextResponse } from 'next/server';
import { usersStore, revisionQueueStore } from '@/lib/globals';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const user = usersStore.find((u) => u.id === userId);
  
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }
  
  const revisionItems = Object.values(revisionQueueStore[userId] || {});
  
  return NextResponse.json({ success: true, user, revisionItems });
}