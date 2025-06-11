import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({ message: "User logout successfully!!!" });

    // Set HTTP-only cookie with token
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    return NextResponse.json({message:"Error while logging out user"}, {status:500})
  }
}