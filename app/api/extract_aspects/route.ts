import { NextResponse } from "next/server"

async function query(data: { inputs: string; parameters: any }) {
  const response = await fetch("https://n7lac2n5ugh1kir2.us-east4.gcp.endpoints.huggingface.cloud", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
  const result = await response.json()
  return result
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    // Using the exact same structure as the test code
    const output = await query({
      inputs: text,
      parameters: {},
    })

    return NextResponse.json(output)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

