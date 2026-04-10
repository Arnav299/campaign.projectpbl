"use client"

import { useSearchParams } from "next/navigation"
import { TargetingManager } from "@/components/targeting-manager"
import { Card, CardContent } from "@/components/ui/card"
import { CampaignSelector } from "@/components/campaign-selector"
import { getTargetingRules } from "@/app/dashboard/targeting/actions"
import { useState, useEffect } from "react"
import { useCampaigns } from "@/components/campaigns-provider"
import type { Campaign } from "@/lib/supabase/types"
import type { TargetingRule } from "@/lib/supabase/types"
import { getLocalTargetingRules } from "@/lib/local-store"

export function TargetingPageClient({
  serverCampaigns,
  initialRules,
  initialCampaignId,
}: {
  serverCampaigns: Campaign[]
  initialRules: TargetingRule[]
  initialCampaignId?: string
}) {
  const searchParams = useSearchParams()
  const { mergeWithServer } = useCampaigns()
  const campaigns = mergeWithServer(serverCampaigns)
  const campaignId = initialCampaignId || searchParams.get("campaign") || campaigns[0]?.id
  const [rules, setRules] = useState(initialRules)

  useEffect(() => {
    if (!campaignId) return
    if (campaignId.startsWith("local-")) {
      setRules(getLocalTargetingRules(campaignId))
    } else {
      getTargetingRules(campaignId).then(setRules)
    }
  }, [campaignId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contextual Targeting</h1>
          <p className="text-muted-foreground">Manage brand safety and contextual targeting keywords</p>
        </div>
        <CampaignSelector
          serverCampaigns={serverCampaigns}
          basePath="/dashboard/targeting"
          defaultValue={campaignId}
        />
      </div>
      {campaigns.length === 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              No campaigns yet. Create a campaign from the Campaigns page to add targeting rules.
            </p>
          </CardContent>
        </Card>
      )}
      <TargetingManager campaignId={campaignId} initialRules={rules} />
    </div>
  )
}
