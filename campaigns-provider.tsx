"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react"
import type { Campaign } from "@/lib/supabase/types"
import { getLocalCampaigns, addLocalCampaign, removeLocalCampaign } from "@/lib/local-campaigns"

interface CampaignsContextValue {
  localCampaigns: Campaign[]
  addCampaign: (campaign: Omit<Campaign, "id" | "created_at">) => Campaign
  removeCampaign: (id: string) => void
  mergeWithServer: (serverCampaigns: Campaign[]) => Campaign[]
}

const CampaignsContext = createContext<CampaignsContextValue | null>(null)

export function CampaignsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(() =>
    getLocalCampaigns()
  )

  const addCampaign = useCallback(
    (campaign: Omit<Campaign, "id" | "created_at">) => {
      const newCampaign = addLocalCampaign(campaign)
      setLocalCampaigns((prev) => [newCampaign, ...prev])
      return newCampaign
    },
    []
  )

  const removeCampaign = useCallback((id: string) => {
    removeLocalCampaign(id)
    setLocalCampaigns((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const mergeWithServer = useCallback(
    (serverCampaigns: Campaign[]) => {
      const serverIds = new Set(serverCampaigns.map((c) => c.id))
      const localOnly = localCampaigns.filter((c) => !serverIds.has(c.id))
      return [...localOnly, ...serverCampaigns]
    },
    [localCampaigns]
  )

  const value = useMemo(
    () => ({ localCampaigns, addCampaign, removeCampaign, mergeWithServer }),
    [localCampaigns, addCampaign, removeCampaign, mergeWithServer]
  )

  return (
    <CampaignsContext.Provider value={value}>
      {children}
    </CampaignsContext.Provider>
  )
}

export function useCampaigns() {
  const ctx = useContext(CampaignsContext)
  if (!ctx) {
    return {
      localCampaigns: [],
      addCampaign: () => ({ id: "", user_id: "", name: "", status: "draft", budget: null, start_date: null, end_date: null, created_at: "" } as Campaign),
      removeCampaign: () => {},
      mergeWithServer: (campaigns: Campaign[]) => campaigns,
    }
  }
  return ctx
}
