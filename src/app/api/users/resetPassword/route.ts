import connect from "@/dbConfig/db-config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "email, password and confirmPassword are required" },
        { status: 400 }
      );
    }

    if (password!==confirmPassword) {
      return NextResponse.json(
        { error: "password & confirmPassword does not match" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOneAndUpdate({ email }, {password: hashedPassword}, {new: true});
    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    } else {
      return NextResponse.json({
        message: "Password reset successfully",
        success: true,
      });
    }
    
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
