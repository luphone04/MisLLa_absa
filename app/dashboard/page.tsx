import { SentimentOverview } from "@/components/sentiment-overview"
import { AspectFrequency } from "@/components/aspect-frequency"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="space-y-8">
        <SentimentOverview />
        <AspectFrequency />
      </div>
    </div>
  )
}

