import connect from '@/dbConfig/db-config';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/app/helpers/get-data-from-token';
import { isValidObjectId } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    const userId = await getDataFromToken(request, token);
    if (!userId || !isValidObjectId(userId)) {
      return NextResponse.json(
        { message: 'Invalid verification token' },
        { status: 401 }
      );
    }

    const user = await User.findOneAndUpdate(
      { 
        _id: userId, 
        isVerified: false 
      },
      { 
        isVerified: true
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password -__v');

    if (!user) {
      return NextResponse.json(
        { message: "User not found or already verified" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User verified successfully!",
        data: {
          id: user._id,
          email: user.email,
          verifiedAt: user.verifiedAt
        }
      }
    );

  } catch (error: any) {
    console.error('POST /api/users/verifyAccount error:', {
      error: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { 
        message: "Server error. Please try again later",
        ...(process.env.NODE_ENV === 'development' && {
          debug: error.message
        })
      },
      { status: 500 }
    );
  }
}