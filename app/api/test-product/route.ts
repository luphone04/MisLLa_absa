import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Create a test product with a review
    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        reviews: {
          create: [
            {
              text: "This is a test review",
              aspects: {
                create: [{ name: "test", sentiment: "positive" }],
              },
            },
          ],
        },
      },
      include: {
        reviews: {
          include: {
            aspects: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "Test data created successfully",
      product: testProduct,
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        error: "Failed to create test data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

