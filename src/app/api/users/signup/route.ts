import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 } // 409 Conflict is appropriate for duplicates
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isActive: false
    });

    // Save user to DB
    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user: {
          id: String(savedUser._id),
          username: savedUser.username,
          email: savedUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
