"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface AnalysisResult {
  result: string
}

export function LiveAnalysis() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [aspects, setAspects] = useState<string[]>([])

  async function analyze() {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch("https://n7lac2n5ugh1kir2.us-east4.gcp.endpoints.huggingface.cloud", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: text,
          parameters: {},
        }),
      })

      const data = (await response.json()) as AnalysisResult
      // Split the result string into an array of aspects
      setAspects(data.result.split(", ").filter(Boolean))
    } catch (error) {
      console.error("Error:", error)
      setAspects([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aspect Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze..."
            className="min-h-[100px] resize-none"
          />
          <Button onClick={analyze} disabled={loading || !text.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </CardContent>
      </Card>

      {aspects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Aspects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {aspects.map((aspect, index) => (
                <Badge key={index} variant="secondary" className="text-base py-1 px-3">
                  {aspect}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

