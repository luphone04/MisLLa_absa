"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { UploadCloud, Loader2, AlertCircle, FileText, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const validateCSV = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n")
        const header = lines[0].toLowerCase().trim()

        if (header !== "review") {
          toast.error("Invalid CSV format", {
            description: "CSV file must have a 'review' column header",
          })
          resolve(false)
          return
        }

        if (lines.length < 2) {
          toast.error("Empty file", {
            description: "CSV file must contain at least one review",
          })
          resolve(false)
          return
        }

        resolve(true)
      }
      reader.readAsText(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.type !== "text/csv") {
      toast.error("Invalid file type", {
        description: "Please upload a CSV file",
      })
      return
    }

    const isValid = await validateCSV(selectedFile)
    if (isValid) {
      setFile(selectedFile)
    } else {
      e.target.value = ""
    }
  }

  const handleUpload = async () => {
    if (!file || !productName.trim()) {
      toast.error("Missing information", {
        description: "Please provide both a product name and a CSV file",
      })
      return
    }

    setIsUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("productName", productName)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      toast.success("Upload successful", {
        description: `Processed ${data.reviewsProcessed} reviews for ${productName}`,
      })

      // Wait for progress animation
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (error) {
      toast.error("Upload failed", {
        description: "There was an error processing your file",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>CSV File Requirements</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>File must be in CSV format</li>
            <li>First row must contain the header &quot;review&quot;</li>
            <li>Each row should contain one review text</li>
            <li>
              Example format:
              <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">
                review{"\n"}
                "The battery life is amazing"{"\n"}
                "The screen quality is excellent"
              </pre>
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload Reviews</CardTitle>
          <CardDescription>Upload reviews for a specific product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              placeholder="Enter product name (e.g., Laptop Model XYZ)"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV file with review data</p>
              </div>
              <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
            </label>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{file.name}</span>
              <Check className="h-4 w-4 text-green-500 ml-auto" />
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">{progress}% complete</p>
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || !productName.trim() || isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Reviews...
              </>
            ) : (
              "Upload and Process Reviews"
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

