"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const existingCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    description: "Promotional campaign for summer products",
    status: "Active",
    cohort: "Young Professionals",
    budget: 5000,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
  },
  {
    id: 2,
    name: "Tech Product Launch",
    description: "Launch campaign for new tech product",
    status: "Active",
    cohort: "Tech Enthusiasts",
    budget: 8000,
    startDate: "2024-07-01",
    endDate: "2024-09-30",
  },
]

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState(existingCampaigns)
  const [isCreating, setIsCreating] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    cohort: "",
    budget: "",
    startDate: "",
    endDate: "",
  })
  const { toast } = useToast()

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.cohort) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      })
      return
    }

    const campaign = {
      id: campaigns.length + 1,
      ...newCampaign,
      status: "Draft",
      budget: Number.parseInt(newCampaign.budget) || 0,
    }

    setCampaigns([...campaigns, campaign])
    setNewCampaign({
      name: "",
      description: "",
      cohort: "",
      budget: "",
      startDate: "",
      endDate: "",
    })
    setIsCreating(false)
    toast({
      title: "Campaign Created",
      description: "Your campaign has been created successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campaign Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
            <CardDescription>Set up a new marketing campaign with targeting parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="Enter campaign name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cohort">Target Cohort *</Label>
                <Select
                  value={newCampaign.cohort}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, cohort: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cohort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-enthusiasts">Tech Enthusiasts</SelectItem>
                    <SelectItem value="young-professionals">Young Professionals</SelectItem>
                    <SelectItem value="fitness-lovers">Fitness Lovers</SelectItem>
                    <SelectItem value="travel-seekers">Travel Seekers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Campaign description"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{campaign.name}</h3>
                    <Badge
                      variant={
                        campaign.status === "Active"
                          ? "default"
                          : campaign.status === "Draft"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{campaign.description}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Cohort: {campaign.cohort}</span>
                    <span>Budget: ${campaign.budget.toLocaleString()}</span>
                    <span>
                      Duration: {campaign.startDate} to {campaign.endDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
