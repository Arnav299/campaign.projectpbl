"use client"

import { CampaignList } from "@/components/campaign-list"
import { useCampaigns } from "@/components/campaigns-provider"
import type { Campaign } from "@/lib/supabase/types"

export function CampaignsPageClient({
  serverCampaigns,
}: {
  serverCampaigns: Campaign[]
}) {
  const { mergeWithServer } = useCampaigns()
  const campaigns = mergeWithServer(serverCampaigns)
  return <CampaignList campaigns={campaigns} />
}
