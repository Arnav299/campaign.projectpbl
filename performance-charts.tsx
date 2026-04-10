"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CampaignMetric } from "@/lib/supabase/types"

interface PerformanceChartsProps {
    metrics: CampaignMetric[]
}

export function PerformanceCharts({ metrics }: PerformanceChartsProps) {
    const chartData = metrics.map((m) => ({
        date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: m.impressions,
        clicks: m.clicks,
        conversions: m.conversions,
        spend: m.spend,
        ctr: m.impressions ? ((m.clicks / m.impressions) * 100).toFixed(2) : 0,
        conversionRate: m.clicks ? ((m.conversions / m.clicks) * 100).toFixed(2) : 0,
    }))

    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
    const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0)
    const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0)
    const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0)

    const avgCTR = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0'
    const avgConversionRate = totalClicks ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0'
    const cpc = totalClicks ? (totalSpend / totalClicks).toFixed(2) : '0'
    const cpa = totalConversions ? (totalSpend / totalConversions).toFixed(2) : '0'

    if (metrics.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No performance data available yet.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">CTR: {avgCTR}%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">CPC: ${cpc}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Rate: {avgConversionRate}%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">CPA: ${cpa}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Traffic Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                            <Line type="monotone" dataKey="conversions" stroke="#ffc658" name="Conversions" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Spend Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="spend" fill="#8884d8" name="Daily Spend ($)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Conversion Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="ctr" stroke="#8884d8" name="CTR (%)" />
                                <Line type="monotone" dataKey="conversionRate" stroke="#82ca9d" name="Conv. Rate (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
