import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Test the connection and create a sample review
    const testReview = await prisma.review.create({
      data: {
        text: "Test review",
        aspects: {
          create: [{ name: "test aspect", sentiment: "positive" }],
        },
      },
    })

    return NextResponse.json({
      status: "Connected to database successfully",
      testReview,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
