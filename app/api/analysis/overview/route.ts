import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        aspects: true,
      },
    })

    const totalReviews = reviews.length
    const aspects = await prisma.aspect.groupBy({
      by: ["name"],
      _count: true,
    })

    const sentiments = await prisma.aspect.groupBy({
      by: ["sentiment"],
      _count: true,
    })

    const sentimentDistribution = {
      positive: sentiments.find((s) => s.sentiment === "positive")?._count ?? 0,
      negative: sentiments.find((s) => s.sentiment === "negative")?._count ?? 0,
      neutral: sentiments.find((s) => s.sentiment === "neutral")?._count ?? 0,
    }

    return NextResponse.json({
      totalReviews,
      totalAspects: aspects.length,
      sentimentDistribution,
    })
  } catch (error) {
    console.error("Error fetching overview:", error)
    return NextResponse.json({ error: "Error fetching overview" }, { status: 500 })
  }
}

