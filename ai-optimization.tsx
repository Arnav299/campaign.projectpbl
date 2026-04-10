"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Zap, TrendingUp, Play, Pause, RotateCcw, Plus } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const banditData = [
  { variant: "Variant A", impressions: 12500, clicks: 375, ctr: 3.0, confidence: 85 },
  { variant: "Variant B", impressions: 11800, clicks: 425, ctr: 3.6, confidence: 92 },
  { variant: "Variant C", impressions: 10200, clicks: 285, ctr: 2.8, confidence: 78 },
]

const performanceData = [
  { day: "Day 1", variantA: 2.8, variantB: 3.1, variantC: 2.5 },
  { day: "Day 2", variantA: 2.9, variantB: 3.3, variantC: 2.7 },
  { day: "Day 3", variantA: 3.0, variantB: 3.5, variantC: 2.6 },
  { day: "Day 4", variantA: 2.8, variantB: 3.6, variantC: 2.8 },
  { day: "Day 5", variantA: 3.1, variantB: 3.8, variantC: 2.9 },
  { day: "Day 6", variantA: 2.9, variantB: 3.7, variantC: 2.7 },
  { day: "Day 7", variantA: 3.0, variantB: 3.9, variantC: 2.8 },
]

const abTests = [
  {
    id: 1,
    name: "Homepage Hero Test",
    status: "Running",
    variants: 2,
    traffic: 50,
    duration: 14,
    winner: null,
  },
  {
    id: 2,
    name: "CTA Button Color",
    status: "Completed",
    variants: 3,
    traffic: 100,
    duration: 7,
    winner: "Variant B",
  },
  {
    id: 3,
    name: "Product Page Layout",
    status: "Draft",
    variants: 2,
    traffic: 0,
    duration: 0,
    winner: null,
  },
]

export function AIOptimization() {
  const [banditStatus, setBanditStatus] = useState<"running" | "paused" | "stopped">("running")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="multi-armed-bandit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="multi-armed-bandit">
            <Brain className="h-4 w-4 mr-2" />
            Multi-Armed Bandit
          </TabsTrigger>
          <TabsTrigger value="ab-testing">
            <Zap className="h-4 w-4 mr-2" />
            A/B Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="multi-armed-bandit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Multi-Armed Bandit Optimization
              </CardTitle>
              <CardDescription>AI-powered automatic optimization across multiple campaign variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant={banditStatus === "running" ? "default" : "secondary"}>
                    {banditStatus === "running" ? "Active" : "Paused"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Running for 7 days</span>
                </div>
                <div className="flex gap-2">
                  {banditStatus === "running" ? (
                    <Button variant="outline" onClick={() => setBanditStatus("paused")}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={() => setBanditStatus("running")}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {banditData.map((variant, index) => (
                  <Card key={variant.variant}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{variant.variant}</h3>
                          {index === 1 && (
                            <Badge variant="default">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Leading
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{variant.ctr}%</div>
                          <div className="text-sm text-muted-foreground">CTR</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Impressions</div>
                          <div className="font-semibold">{variant.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Clicks</div>
                          <div className="font-semibold">{variant.clicks}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Confidence</div>
                          <div className="font-semibold">{variant.confidence}%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level</span>
                          <span>{variant.confidence}%</span>
                        </div>
                        <Progress value={variant.confidence} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      variantA: {
                        label: "Variant A",
                        color: "hsl(var(--chart-1))",
                      },
                      variantB: {
                        label: "Variant B",
                        color: "hsl(var(--chart-2))",
                      },
                      variantC: {
                        label: "Variant C",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="variantA" stroke="var(--color-variantA)" strokeWidth={2} />
                        <Line type="monotone" dataKey="variantB" stroke="var(--color-variantB)" strokeWidth={2} />
                        <Line type="monotone" dataKey="variantC" stroke="var(--color-variantC)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>A/B Test Management</CardTitle>
              <CardDescription>Create and manage A/B tests for campaign optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTests.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{test.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{test.variants} variants</span>
                            <span>{test.traffic}% traffic</span>
                            <span>{test.duration} days</span>
                            {test.winner && <Badge variant="default">Winner: {test.winner}</Badge>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              test.status === "Running"
                                ? "default"
                                : test.status === "Completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {test.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New A/B Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
