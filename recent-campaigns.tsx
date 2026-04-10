import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2024",
    status: "Active",
    cohort: "Young Professionals",
    performance: "High",
    ctr: "3.2%",
  },
  {
    id: 2,
    name: "Tech Product Launch",
    status: "Active",
    cohort: "Tech Enthusiasts",
    performance: "Medium",
    ctr: "2.8%",
  },
  {
    id: 3,
    name: "Fitness Challenge",
    status: "Paused",
    cohort: "Fitness Lovers",
    performance: "Low",
    ctr: "1.9%",
  },
  {
    id: 4,
    name: "Travel Deals",
    status: "Active",
    cohort: "Travel Seekers",
    performance: "High",
    ctr: "4.1%",
  },
]

export function RecentCampaigns() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
        <CardDescription>Overview of your latest campaign activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{campaign.name}</p>
                <p className="text-sm text-muted-foreground">Cohort: {campaign.cohort}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>{campaign.status}</Badge>
                <Badge
                  variant={
                    campaign.performance === "High"
                      ? "default"
                      : campaign.performance === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {campaign.performance}
                </Badge>
                <span className="text-sm font-medium">{campaign.ctr}</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
