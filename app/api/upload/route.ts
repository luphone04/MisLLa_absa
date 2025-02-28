import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as csv from "csv-parse/sync"

const prisma = new PrismaClient()

interface ReviewRecord {
  review: string
  [key: string]: string
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const productName = formData.get("productName") as string

    if (!file || !productName) {
      return NextResponse.json(
        {
          error: "Missing file or product name",
        },
        { status: 400 },
      )
    }

    const text = await file.text()

    const records = csv.parse(text, {
      columns: true,
      skip_empty_lines: true,
    }) as ReviewRecord[]

    if (!records.length || !records[0].hasOwnProperty("review")) {
      return NextResponse.json(
        {
          error: "Invalid CSV format. File must have a 'review' column.",
        },
        { status: 400 },
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: productName,
          reviews: {
            create: records.map((record) => ({
              text: record.review,
            })),
          },
        },
        include: {
          reviews: true,
        },
      })

      return { product, reviewCount: product.reviews.length }
    })

    return NextResponse.json({
      message: "File processed successfully",
      reviewsProcessed: result.reviewCount,
      productName: result.product.name,
    })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json(
      {
        error: "Error processing file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

