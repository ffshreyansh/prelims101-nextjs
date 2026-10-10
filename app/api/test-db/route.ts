import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Force Prisma to connect
    await prisma.$connect();
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connected successfully!" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Database connection failed", 
      error: error.message
    }, { status: 500 });
  } finally {
    // Optional: Disconnect after testing (usually handled automatically by Prisma)
    await prisma.$disconnect();
  }
}