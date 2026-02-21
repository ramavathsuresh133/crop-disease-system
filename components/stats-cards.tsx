import { ScanLine, Bug, Bell, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: ScanLine,
    label: "Total Scans",
    value: "24",
    change: "+3 this week",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Bug,
    label: "Diseases Found",
    value: "8",
    change: "4 unique diseases",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Bell,
    label: "Alerts Received",
    value: "12",
    change: "3 new today",
    color: "text-warning-foreground",
    bg: "bg-warning/10",
  },
  {
    icon: ShieldCheck,
    label: "Healthy Scans",
    value: "16",
    change: "67% healthy rate",
    color: "text-success",
    bg: "bg-success/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
