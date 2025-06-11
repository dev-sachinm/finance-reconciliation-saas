import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/app/helpers/getDataFromToken';
import connect from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

export async function GET(request: NextRequest) {
  try {
    await connect().catch(error => {
      throw new Error('Database connection failed');
    });

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: user });

  } catch (error) {
    console.error('User fetch error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch user data';

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}