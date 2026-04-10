"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const performanceData = [
  { month: "Jan", campaigns: 12, conversions: 245, revenue: 12400 },
  { month: "Feb", campaigns: 15, conversions: 312, revenue: 15600 },
  { month: "Mar", campaigns: 18, conversions: 387, revenue: 19350 },
  { month: "Apr", campaigns: 22, conversions: 445, revenue: 22250 },
  { month: "May", campaigns: 24, conversions: 523, revenue: 26150 },
  { month: "Jun", campaigns: 28, conversions: 612, revenue: 30600 },
]

const cohortData = [
  { cohort: "Tech Enthusiasts", size: 12500, engagement: 78 },
  { cohort: "Young Professionals", size: 8900, engagement: 65 },
  { cohort: "Fitness Lovers", size: 15600, engagement: 82 },
  { cohort: "Travel Seekers", size: 7800, engagement: 71 },
  { cohort: "Food Enthusiasts", size: 11200, engagement: 69 },
]

export function OverviewCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Monthly campaign performance and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              campaigns: {
                label: "Campaigns",
                color: "hsl(var(--chart-1))",
              },
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="campaigns" stroke="var(--color-campaigns)" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Engagement</CardTitle>
          <CardDescription>Engagement rates across different cohorts</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              engagement: {
                label: "Engagement %",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortData}>
                <XAxis dataKey="cohort" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="engagement" fill="var(--color-engagement)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
