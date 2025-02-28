import { prisma } from "../lib/db"

async function testConnection() {
  try {
    // Test the connection
    const products = await prisma.product.findMany({
      include: {
        reviews: {
          include: {
            aspects: true,
          },
        },
      },
    })

    console.log("Database connection successful!")
    console.log("Products found:", products.length)
    console.log("Products:", JSON.stringify(products, null, 2))
  } catch (error) {
    console.error("Database connection error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

