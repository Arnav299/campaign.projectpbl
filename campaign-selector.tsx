"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Campaign } from "@/lib/supabase/types"
import { useCampaigns } from "@/components/campaigns-provider"

export function CampaignSelector({
  serverCampaigns,
  basePath,
  defaultValue,
}: {
  serverCampaigns: Campaign[]
  basePath: string
  defaultValue?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mergeWithServer } = useCampaigns()
  const campaigns = mergeWithServer(serverCampaigns)
  const campaignId = defaultValue || searchParams.get("campaign") || campaigns[0]?.id

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("campaign", value)
    router.push(`${basePath}?${params.toString()}`)
  }

  if (campaigns.length === 0) return null

  return (
    <Select value={campaignId || ""} onValueChange={handleChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select campaign" />
      </SelectTrigger>
      <SelectContent>
        {campaigns.map((campaign) => (
          <SelectItem key={campaign.id} value={campaign.id}>
            {campaign.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
