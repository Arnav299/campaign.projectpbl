import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, DollarSign } from "lucide-react"

const metrics = [
  {
    title: "Active Campaigns",
    value: "24",
    change: "+12%",
    icon: Target,
  },
  {
    title: "Total Cohorts",
    value: "156",
    change: "+8%",
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    icon: TrendingUp,
  },
  {
    title: "Revenue",
    value: "$45,231",
    change: "+23%",
    icon: DollarSign,
  },
]

export function PerformanceMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{metric.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
