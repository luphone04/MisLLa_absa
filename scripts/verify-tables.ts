import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function verifyTables() {
  try {
    console.log("Testing database connection...")

    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: "Test Product",
        reviews: {
          create: [
            {
              text: "Test Review",
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

    console.log("\nSuccessfully created test data:")
    console.log(JSON.stringify(product, null, 2))
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTables()

