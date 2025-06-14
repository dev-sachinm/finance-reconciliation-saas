import connect from "@/dbConfig/db-config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/app/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { id, email } = await request.json();
    if (!id || !email) {
      return NextResponse.json(
        { message: "User ID and email are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isActive) {
      return NextResponse.json(
        { message: "User is already verified" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        purpose: "account_verification"
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: process.env.VERIFY_TOKEN_EXPIRY }
    );

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + parseInt(process.env.VERIFY_TOKEN_EXPIRY_MS!)
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user record");
    }

    // 7. Send verification email
    const verificationUrl = `${process.env.DOMAIN}/verifyAccount?token=${encodeURIComponent(token)}`;
    const emailResponse = await sendEmail({
      to: user.email,
      subject: process.env.ACCOUNT_VERIFY_EMAIL_SUBJECT!,
      html: `
        <h1>Hello ${user.username},</h1>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    if (!emailResponse.success) {
      throw new Error(emailResponse.message || "Failed to send verification email");
    }

    return NextResponse.json(
      {
        message: "Verification email sent successfully",
        debug: { userId: user._id, email: user.email } 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Email verification error:", {
      error: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        suggestion: "Please try again or contact support"
      },
      { status: 500 }
    );
  }
}