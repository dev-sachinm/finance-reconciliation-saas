import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "User is not activated" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenData = {
      id: user._id.toString(),
      email: user.email,
      username: user.username
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
