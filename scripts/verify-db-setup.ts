import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function verifyDatabaseSetup() {
  try {
    // Test creating a product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        reviews: {
          create: [
            {
              text: "This is a test review",
              aspects: {
                create: [
                  {
                    name: "quality",
                    sentiment: "positive",
                  },
                ],
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

    console.log("Successfully created test product:", product)

    // Verify we can query it back
    const products = await prisma.product.findMany({
      include: {
        reviews: {
          include: {
            aspects: true,
          },
        },
      },
    })

    console.log("\nDatabase content:", JSON.stringify(products, null, 2))
  } catch (error) {
    console.error("Database verification failed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabaseSetup()

