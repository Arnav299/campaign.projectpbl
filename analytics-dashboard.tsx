"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Target, DollarSign, Eye, MousePointer } from "lucide-react"

const campaignPerformance = [
  { date: "2024-01-01", impressions: 12500, clicks: 375, conversions: 45, revenue: 2250 },
  { date: "2024-01-02", impressions: 13200, clicks: 412, conversions: 52, revenue: 2600 },
  { date: "2024-01-03", impressions: 11800, clicks: 354, conversions: 41, revenue: 2050 },
  { date: "2024-01-04", impressions: 14100, clicks: 451, conversions: 58, revenue: 2900 },
  { date: "2024-01-05", impressions: 13800, clicks: 428, conversions: 55, revenue: 2750 },
  { date: "2024-01-06", impressions: 15200, clicks: 487, conversions: 62, revenue: 3100 },
  { date: "2024-01-07", impressions: 14600, clicks: 467, conversions: 59, revenue: 2950 },
]

const cohortPerformance = [
  { cohort: "Tech Enthusiasts", users: 12500, revenue: 45000, avgOrder: 180 },
  { cohort: "Young Professionals", users: 8900, revenue: 32000, avgOrder: 160 },
  { cohort: "Fitness Lovers", users: 15600, revenue: 52000, avgOrder: 140 },
  { cohort: "Travel Seekers", users: 7800, revenue: 28000, avgOrder: 200 },
  { cohort: "Food Enthusiasts", users: 11200, revenue: 38000, avgOrder: 170 },
]

const deviceBreakdown = [
  { name: "Desktop", value: 45, color: "#8884d8" },
  { name: "Mobile", value: 40, color: "#82ca9d" },
  { name: "Tablet", value: 15, color: "#ffc658" },
]

const conversionFunnel = [
  { stage: "Impressions", count: 100000, percentage: 100 },
  { stage: "Clicks", count: 3200, percentage: 3.2 },
  { stage: "Visits", count: 2800, percentage: 2.8 },
  { stage: "Leads", count: 420, percentage: 0.42 },
  { stage: "Conversions", count: 84, percentage: 0.084 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$195K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+23%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Over Time</CardTitle>
                <CardDescription>Daily metrics for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    impressions: {
                      label: "Impressions",
                      color: "hsl(var(--chart-1))",
                    },
                    clicks: {
                      label: "Clicks",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={campaignPerformance}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="impressions"
                        stackId="1"
                        stroke="var(--color-impressions)"
                        fill="var(--color-impressions)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stackId="2"
                        stroke="var(--color-clicks)"
                        fill="var(--color-clicks)"
                        fillOpacity={0.8}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue & Conversions</CardTitle>
                <CardDescription>Revenue and conversion trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-3))",
                    },
                    conversions: {
                      label: "Conversions",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={campaignPerformance}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cohort Performance Analysis</CardTitle>
              <CardDescription>Revenue and user metrics by cohort</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortPerformance}>
                    <XAxis dataKey="cohort" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    <Bar dataKey="users" fill="var(--color-users)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Traffic distribution by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    desktop: {
                      label: "Desktop",
                      color: "#8884d8",
                    },
                    mobile: {
                      label: "Mobile",
                      color: "#82ca9d",
                    },
                    tablet: {
                      label: "Tablet",
                      color: "#ffc658",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Performance</CardTitle>
                <CardDescription>Key metrics by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceBreakdown.map((device) => (
                    <div key={device.name} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: device.color }} />
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{device.value}%</div>
                        <div className="text-sm text-muted-foreground">of traffic</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from impression to conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{stage.stage}</h3>
                          <p className="text-sm text-muted-foreground">{stage.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{stage.count.toLocaleString()}</div>
                        {index > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {((stage.count / conversionFunnel[index - 1].count) * 100).toFixed(1)}% conversion
                          </div>
                        )}
                      </div>
                    </div>
                    {index < conversionFunnel.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-px h-4 bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
