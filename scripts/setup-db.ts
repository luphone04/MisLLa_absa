import { prisma } from "../lib/db"

async function setupDatabase() {
  try {
    // Create a test product
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

    console.log("Database setup successful!")
    console.log("Created test product:", JSON.stringify(product, null, 2))
  } catch (error) {
    console.error("Database setup error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()

