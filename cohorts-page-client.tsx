"use client"

import { useState, useEffect } from "react"
import { CohortList } from "@/components/cohort-list"
import { getLocalCohorts } from "@/lib/local-store"
import type { Cohort } from "@/lib/supabase/types"

export function CohortsPageClient({ serverCohorts }: { serverCohorts: Cohort[] }) {
  const [localCohorts, setLocalCohorts] = useState<Cohort[]>([])

  useEffect(() => {
    setLocalCohorts(getLocalCohorts())
  }, [])

  useEffect(() => {
    const handler = () => setLocalCohorts(getLocalCohorts())
    window.addEventListener('cohorts-updated', handler)
    return () => window.removeEventListener('cohorts-updated', handler)
  }, [])

  const cohorts = [...localCohorts, ...serverCohorts]

  return (
    <CohortList
      cohorts={cohorts}
      onLocalDelete={() => setLocalCohorts(getLocalCohorts())}
    />
  )
}
