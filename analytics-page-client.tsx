"use client"

import { useSearchParams } from "next/navigation"
import { PerformanceCharts } from "@/components/performance-charts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CampaignSelector } from "@/components/campaign-selector"
import { getCampaignMetrics, generateDummyMetrics } from "@/app/dashboard/analytics/actions"
import { useState, useEffect } from "react"
import { useCampaigns } from "@/components/campaigns-provider"
import type { Campaign } from "@/lib/supabase/types"
import type { CampaignMetric } from "@/lib/supabase/types"
import { getLocalMetrics, generateLocalMetrics } from "@/lib/local-store"

export function AnalyticsPageClient({
  serverCampaigns,
  initialMetrics,
  initialCampaignId,
}: {
  serverCampaigns: Campaign[]
  initialMetrics: CampaignMetric[]
  initialCampaignId?: string
}) {
  const searchParams = useSearchParams()
  const { mergeWithServer } = useCampaigns()
  const campaigns = mergeWithServer(serverCampaigns)
  const campaignId = initialCampaignId || searchParams.get("campaign") || campaigns[0]?.id
  const [metrics, setMetrics] = useState(initialMetrics)

  useEffect(() => {
    if (!campaignId) return
    if (campaignId.startsWith("local-")) {
      const local = getLocalMetrics(campaignId)
      setMetrics(local.length > 0 ? local : generateLocalMetrics(campaignId))
    } else {
      getCampaignMetrics(campaignId).then(setMetrics)
    }
  }, [campaignId])

  const handleGenerateDemo = async () => {
    if (!campaignId) return
    if (campaignId.startsWith("local-")) {
      setMetrics(generateLocalMetrics(campaignId))
    } else {
      const result = await generateDummyMetrics(campaignId)
      if (result?.success) {
        const m = await getCampaignMetrics(campaignId)
        setMetrics(m)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Performance</h1>
          <p className="text-muted-foreground">Detailed performance analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <CampaignSelector
            serverCampaigns={serverCampaigns}
            basePath="/dashboard/analytics"
            defaultValue={campaignId}
          />
          {metrics.length === 0 && campaignId && (
            <Button variant="outline" onClick={handleGenerateDemo}>
              Generate Demo Data
            </Button>
          )}
        </div>
      </div>
      {campaigns.length === 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              No campaigns yet. Create a campaign from the Campaigns page to view analytics.
            </p>
          </CardContent>
        </Card>
      )}
      <PerformanceCharts metrics={metrics} />
    </div>
  )
}
