"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  MoreHorizontal,
  Calendar,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const allCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    description: "Promotional campaign for summer products with exclusive discounts",
    status: "Active",
    cohort: "Young Professionals",
    performance: "High",
    ctr: "3.2%",
    conversions: 245,
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 4000,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    createdAt: "2024-05-28",
    lastModified: "2024-06-15",
  },
  {
    id: 2,
    name: "Tech Product Launch",
    description: "Launch campaign for new innovative tech product targeting early adopters",
    status: "Active",
    cohort: "Tech Enthusiasts",
    performance: "Medium",
    ctr: "2.8%",
    conversions: 189,
    budget: 8000,
    spent: 4500,
    impressions: 98000,
    clicks: 2744,
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    createdAt: "2024-06-25",
    lastModified: "2024-07-10",
  },
  {
    id: 3,
    name: "Fitness Challenge",
    description: "30-day fitness challenge campaign with community engagement",
    status: "Paused",
    cohort: "Fitness Lovers",
    performance: "Low",
    ctr: "1.9%",
    conversions: 67,
    budget: 3000,
    spent: 1800,
    impressions: 65000,
    clicks: 1235,
    startDate: "2024-05-15",
    endDate: "2024-07-15",
    createdAt: "2024-05-10",
    lastModified: "2024-06-20",
  },
  {
    id: 4,
    name: "Travel Deals",
    description: "Exclusive travel packages and destination deals for adventure seekers",
    status: "Active",
    cohort: "Travel Seekers",
    performance: "High",
    ctr: "4.1%",
    conversions: 312,
    budget: 6000,
    spent: 4200,
    impressions: 87000,
    clicks: 3567,
    startDate: "2024-06-10",
    endDate: "2024-08-10",
    createdAt: "2024-06-05",
    lastModified: "2024-07-01",
  },
  {
    id: 5,
    name: "Back to School",
    description: "Educational products and supplies for students and parents",
    status: "Draft",
    cohort: "Parents & Students",
    performance: "N/A",
    ctr: "0%",
    conversions: 0,
    budget: 4000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    startDate: "2024-08-01",
    endDate: "2024-09-15",
    createdAt: "2024-07-20",
    lastModified: "2024-07-22",
  },
  {
    id: 6,
    name: "Holiday Shopping",
    description: "Early holiday shopping campaign with gift recommendations",
    status: "Completed",
    cohort: "Holiday Shoppers",
    performance: "High",
    ctr: "3.8%",
    conversions: 456,
    budget: 10000,
    spent: 9800,
    impressions: 156000,
    clicks: 5928,
    startDate: "2024-11-01",
    endDate: "2024-12-25",
    createdAt: "2024-10-15",
    lastModified: "2024-12-26",
  },
]

export function RecentCampaignsView() {
  const [campaigns, setCampaigns] = useState(allCampaigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [performanceFilter, setPerformanceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("lastModified")
  const { toast } = useToast()

  const filteredCampaigns = campaigns
    .filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.cohort.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter.toLowerCase()
      const matchesPerformance =
        performanceFilter === "all" || campaign.performance.toLowerCase() === performanceFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesPerformance
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "status":
          return a.status.localeCompare(b.status)
        case "performance":
          return a.performance.localeCompare(b.performance)
        case "budget":
          return b.budget - a.budget
        case "ctr":
          return Number.parseFloat(b.ctr) - Number.parseFloat(a.ctr)
        case "lastModified":
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
      }
    })

  const handleCampaignAction = (action: string, campaignId: number) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) return

    switch (action) {
      case "pause":
        setCampaigns(campaigns.map((c) => (c.id === campaignId ? { ...c, status: "Paused" } : c)))
        toast({
          title: "Campaign Paused",
          description: `"${campaign.name}" has been paused`,
        })
        break
      case "resume":
        setCampaigns(campaigns.map((c) => (c.id === campaignId ? { ...c, status: "Active" } : c)))
        toast({
          title: "Campaign Resumed",
          description: `"${campaign.name}" is now active`,
        })
        break
      case "duplicate":
        const newCampaign = {
          ...campaign,
          id: Math.max(...campaigns.map((c) => c.id)) + 1,
          name: `${campaign.name} (Copy)`,
          status: "Draft",
          spent: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: "0%",
          createdAt: new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
        }
        setCampaigns([newCampaign, ...campaigns])
        toast({
          title: "Campaign Duplicated",
          description: `"${campaign.name}" has been duplicated`,
        })
        break
      case "delete":
        setCampaigns(campaigns.filter((c) => c.id !== campaignId))
        toast({
          title: "Campaign Deleted",
          description: `"${campaign.name}" has been deleted`,
          variant: "destructive",
        })
        break
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance.toLowerCase()) {
      case "high":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "low":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "medium":
        return <Minus className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "completed":
        return "outline"
      case "draft":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance.toLowerCase()) {
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Performance</label>
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastModified">Last Modified</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="ctr">CTR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setPerformanceFilter("all")
                  setSortBy("lastModified")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter((c) => c.status === "Active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredCampaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ${filteredCampaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()} spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CTR</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                filteredCampaigns.reduce((sum, c) => sum + Number.parseFloat(c.ctr), 0) / filteredCampaigns.length || 0
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {campaign.status === "Active" ? (
                          <DropdownMenuItem onClick={() => handleCampaignAction("pause", campaign.id)}>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Campaign
                          </DropdownMenuItem>
                        ) : campaign.status === "Paused" ? (
                          <DropdownMenuItem onClick={() => handleCampaignAction("resume", campaign.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Resume Campaign
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleCampaignAction("delete", campaign.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    <Badge variant={getPerformanceColor(campaign.performance)} className="flex items-center gap-1">
                      {getPerformanceIcon(campaign.performance)}
                      {campaign.performance}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cohort</p>
                      <p className="font-medium">{campaign.cohort}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CTR</p>
                      <p className="font-medium">{campaign.ctr}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conversions</p>
                      <p className="font-medium">{campaign.conversions}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Used</span>
                      <span>{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                    <p>Modified: {new Date(campaign.lastModified).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Campaign</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Performance</th>
                      <th className="p-4 font-medium">Cohort</th>
                      <th className="p-4 font-medium">CTR</th>
                      <th className="p-4 font-medium">Budget</th>
                      <th className="p-4 font-medium">Conversions</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{campaign.description}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={getPerformanceColor(campaign.performance)}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getPerformanceIcon(campaign.performance)}
                            {campaign.performance}
                          </Badge>
                        </td>
                        <td className="p-4">{campaign.cohort}</td>
                        <td className="p-4 font-medium">{campaign.ctr}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">${campaign.budget.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">${campaign.spent.toLocaleString()} spent</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{campaign.conversions}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Campaign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {campaign.status === "Active" ? (
                                <DropdownMenuItem onClick={() => handleCampaignAction("pause", campaign.id)}>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause Campaign
                                </DropdownMenuItem>
                              ) : campaign.status === "Paused" ? (
                                <DropdownMenuItem onClick={() => handleCampaignAction("resume", campaign.id)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Resume Campaign
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleCampaignAction("delete", campaign.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Campaign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground text-center mb-4">
              No campaigns match your current filters. Try adjusting your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPerformanceFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
