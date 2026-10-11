import { NextRequest, NextResponse } from 'next/server';
import { usersStore, revisionQueueStore } from '@/lib/globals';
import { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, targetYear, optionalSubject } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required.' }, { status: 400 });
    }

    const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({ success: true, user: existing, message: 'Existing profile loaded.' });
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      targetYear: targetYear || '2025',
      optionalSubject: optionalSubject || 'General Studies',
      isGuest: false,
      freeTestsRemaining: 5,
      isSubscribed: false,
      planType: 'free',
      createdAt: new Date().toISOString(),
    };

    usersStore.push(newUser);
    revisionQueueStore[newUser.id] = {};
    
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
  }
}