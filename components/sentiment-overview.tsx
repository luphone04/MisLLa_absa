"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export function SentimentOverview() {
  // Mock data - replace with actual data from your API/database
  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderColor: ["#16a34a", "#dc2626", "#d97706"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Sentiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral Sentiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-md mx-auto">
            <Pie data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

