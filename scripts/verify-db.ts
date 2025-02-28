import { prisma } from "../lib/db"

async function verifyDatabase() {
  try {
    // Check products
    const products = await prisma.product.findMany({
      include: {
        reviews: {
          include: {
            aspects: true,
          },
        },
      },
    })

    console.log("Products:", products.length)
    console.log("First product:", JSON.stringify(products[0], null, 2))

    // Check reviews
    const reviews = await prisma.review.findMany({
      include: {
        product: true,
        aspects: true,
      },
    })

    console.log("\nReviews:", reviews.length)
    console.log("First review:", JSON.stringify(reviews[0], null, 2))
  } catch (error) {
    console.error("Verification error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()

