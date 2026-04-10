"use client"

import { useSearchParams } from "next/navigation"
import { OptimizationManager } from "@/components/optimization-manager"
import { CampaignSelector } from "@/components/campaign-selector"
import { getExperiments } from "@/app/dashboard/optimization/actions"
import { useState, useEffect } from "react"
import { useCampaigns } from "@/components/campaigns-provider"
import type { Campaign } from "@/lib/supabase/types"
import type { Experiment } from "@/lib/supabase/types"
import { getLocalExperiments } from "@/lib/local-store"
import { Card, CardContent } from "@/components/ui/card"

export function OptimizationPageClient({
  serverCampaigns,
  initialExperiments,
  initialCampaignId,
}: {
  serverCampaigns: Campaign[]
  initialExperiments: Experiment[]
  initialCampaignId?: string
}) {
  const searchParams = useSearchParams()
  const { mergeWithServer } = useCampaigns()
  const campaigns = mergeWithServer(serverCampaigns)
  const campaignId = initialCampaignId || searchParams.get("campaign") || campaigns[0]?.id
  const [experiments, setExperiments] = useState(initialExperiments)

  useEffect(() => {
    if (!campaignId) return
    if (campaignId.startsWith("local-")) {
      setExperiments(getLocalExperiments(campaignId))
    } else {
      getExperiments(campaignId).then(setExperiments)
    }
  }, [campaignId])

  useEffect(() => {
    if (!campaignId?.startsWith("local-")) return
    const handler = () => setExperiments(getLocalExperiments(campaignId))
    window.addEventListener("experiments-updated", handler)
    return () => window.removeEventListener("experiments-updated", handler)
  }, [campaignId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Optimization</h1>
          <p className="text-muted-foreground">Multi-armed bandit and A/B testing optimization</p>
        </div>
        <CampaignSelector
          serverCampaigns={serverCampaigns}
          basePath="/dashboard/optimization"
          defaultValue={campaignId}
        />
      </div>
      {campaigns.length === 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              No campaigns yet. Create a campaign from the Campaigns page to set up A/B tests.
            </p>
          </CardContent>
        </Card>
      )}
      <OptimizationManager campaignId={campaignId} experiments={experiments} />
    </div>
  )
}
