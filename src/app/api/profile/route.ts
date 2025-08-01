import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connect from '@/dbConfig/db-config';
import User from '@/models/userModel';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connect();
    console.log(session.user)
    const user = await User.findById(session.user.id).select('-password -verifyToken -verifyTokenExpiry -__v');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}