"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface Product {
  id: string
  name: string
}

interface Aspect {
  id: string
  name: string
  sentiment: string
}

interface Review {
  id: string
  text: string
  productId: string
  aspects: Aspect[]
  product?: {
    name: string
  }
}

export function ReviewExplorer() {
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("all")
  const [selectedAspect, setSelectedAspect] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reviews")
        const data = await response.json()
        if (data.reviews) {
          setReviews(data.reviews)

          // Extract unique products from reviews with proper type casting
          const uniqueProducts: Product[] = Array.from(
            new Set(data.reviews.map((review: Review) => review.productId)),
          ).map(
            (productId): Product => ({
              id: productId as string,
              name: data.reviews.find((r: Review) => r.productId === productId)?.product?.name || "Unknown Product",
            }),
          )

          setProducts(uniqueProducts)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Only compute uniqueAspects if reviews array exists and is not empty
  const uniqueAspects =
    reviews.length > 0
      ? Array.from(new Set(reviews.flatMap((review) => review.aspects?.map((aspect) => aspect.name) || [])))
      : []

  const filteredReviews = reviews.filter((review) => {
    const matchesProduct = selectedProduct === "all" || review.productId === selectedProduct
    const matchesAspect = selectedAspect === "all" || review.aspects?.some((aspect) => aspect.name === selectedAspect)
    const matchesSearch = review.text.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesProduct && matchesAspect && matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6">
          <div className="grid gap-2">
            <Label htmlFor="product-select">Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger id="product-select">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="aspect-select">Aspect</Label>
            <Select value={selectedAspect} onValueChange={setSelectedAspect}>
              <SelectTrigger id="aspect-select">
                <SelectValue placeholder="Select aspect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All aspects</SelectItem>
                {uniqueAspects.map((aspect) => (
                  <SelectItem key={aspect} value={aspect}>
                    {aspect}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading reviews...</p>
          ) : filteredReviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews found</p>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm text-gray-500 mb-1">
                      {review.product?.name || "Unknown Product"}
                    </p>
                    <p className="flex-1">{review.text}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.aspects?.map((aspect) => (
                    <Badge
                      key={aspect.id}
                      variant={
                        aspect.sentiment === "positive"
                          ? "default"
                          : aspect.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {aspect.name}: {aspect.sentiment}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

